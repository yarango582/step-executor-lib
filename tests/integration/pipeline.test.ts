import { Pipeline } from "../../src/core/pipeline";
import { Step } from "../../src/core/step";
import { Executor } from "../../src/core/executor";
import { DependencyResolver } from "../../src/utils/dependency-resolver";
import { MixedStrategy } from "../../src/strategies/mixed.strategy";

describe("Integration Tests", () => {
  describe("Complete Workflow with Dependencies", () => {
    test("should execute a complete deployment pipeline with dependencies", async () => {
      const executor = new Executor("sequential");
      const resolver = new DependencyResolver();
      const executionOrder: string[] = [];

      // Define steps
      const steps = {
        build: new Step("build", async () => {
          executionOrder.push("build");
          return "Build completed";
        }),
        test: new Step("test", async () => {
          executionOrder.push("test");
          return "Tests passed";
        }),
        "deploy-staging": new Step("deploy-staging", async () => {
          executionOrder.push("deploy-staging");
          return "Deployed to staging";
        }),
        "integration-tests": new Step("integration-tests", async () => {
          executionOrder.push("integration-tests");
          return "Integration tests passed";
        }),
        "deploy-prod": new Step("deploy-prod", async () => {
          executionOrder.push("deploy-prod");
          return "Deployed to production";
        }),
      };

      // Set up dependencies
      resolver.addStep(steps["build"], []);
      resolver.addStep(steps["test"], ["build"]);
      resolver.addStep(steps["deploy-staging"], ["test"]);
      resolver.addStep(steps["integration-tests"], ["deploy-staging"]);
      resolver.addStep(steps["deploy-prod"], ["integration-tests"]);

      // Get execution order
      const order = resolver.resolveOrder();

      // Register steps with executor
      Object.entries(steps).forEach(([name, step]) => {
        executor.registerStep(name, step.execute.bind(step));
      });

      // Execute in dependency order
      await executor.execute(order);

      // Verify execution order
      expect(executionOrder).toEqual([
        "build",
        "test",
        "deploy-staging",
        "integration-tests",
        "deploy-prod",
      ]);
    });

    test("should handle parallel execution of independent services", async () => {
      const executor = new Executor("parallel");
      const results: string[] = [];
      const startTimes: Record<string, number> = {};
      const endTimes: Record<string, number> = {};

      // Simulate microservices deployment
      const services = ["auth-service", "user-service", "payment-service"];

      services.forEach((service) => {
        executor.registerStep(service, async () => {
          startTimes[service] = Date.now();
          await new Promise((resolve) => setTimeout(resolve, 100));
          endTimes[service] = Date.now();
          results.push(service);
          return `${service} deployed`;
        });
      });

      const overallStart = Date.now();
      await executor.execute(services);
      const overallEnd = Date.now();

      // All services should be deployed
      expect(results).toHaveLength(3);
      expect(results).toContain("auth-service");
      expect(results).toContain("user-service");
      expect(results).toContain("payment-service");

      // Should complete in roughly 100ms (parallel) not 300ms (sequential)
      expect(overallEnd - overallStart).toBeLessThan(200);

      // All services should start around the same time
      const startTimeValues = Object.values(startTimes);
      const maxStartDiff =
        Math.max(...startTimeValues) - Math.min(...startTimeValues);
      expect(maxStartDiff).toBeLessThan(50); // Should start within 50ms of each other
    });

    test("should handle mixed strategy with database setup and parallel services", async () => {
      const executionOrder: string[] = [];

      // Sequential steps (infrastructure)
      const sequentialSteps = [
        new Step("setup-database", async () => {
          await new Promise((resolve) => setTimeout(resolve, 50));
          executionOrder.push("setup-database");
          return "Database ready";
        }),
        new Step("run-migrations", async () => {
          await new Promise((resolve) => setTimeout(resolve, 50));
          executionOrder.push("run-migrations");
          return "Migrations complete";
        }),
      ];

      // Parallel steps (services)
      const parallelSteps = [
        new Step("start-api", async () => {
          await new Promise((resolve) => setTimeout(resolve, 30));
          executionOrder.push("start-api");
          return "API started";
        }),
        new Step("start-worker", async () => {
          await new Promise((resolve) => setTimeout(resolve, 30));
          executionOrder.push("start-worker");
          return "Worker started";
        }),
        new Step("start-scheduler", async () => {
          await new Promise((resolve) => setTimeout(resolve, 30));
          executionOrder.push("start-scheduler");
          return "Scheduler started";
        }),
      ];

      const mixedStrategy = new MixedStrategy(sequentialSteps, parallelSteps);

      const startTime = Date.now();
      await mixedStrategy.execute();
      const endTime = Date.now();

      // Verify execution order
      expect(executionOrder[0]).toBe("setup-database");
      expect(executionOrder[1]).toBe("run-migrations");

      // Parallel services should execute after sequential steps
      const parallelServices = ["start-api", "start-worker", "start-scheduler"];
      const parallelServicesInOrder = executionOrder.slice(2);

      parallelServices.forEach((service) => {
        expect(parallelServicesInOrder).toContain(service);
      });

      // Should complete faster than fully sequential execution
      expect(endTime - startTime).toBeLessThan(200); // Sequential: ~130ms, Parallel services: ~30ms additional
    });
  });

  describe("Error Handling in Complex Scenarios", () => {
    test("should handle dependency resolution with missing dependencies", () => {
      const resolver = new DependencyResolver();
      const step = new Step("dependent-step", async () => "result");

      // Add step with non-existent dependency
      resolver.addStep(step, ["non-existent-dependency"]);

      // Should still resolve (missing dependencies are just nodes)
      const order = resolver.resolveOrder();
      expect(order).toContain("dependent-step");
      expect(order).toContain("non-existent-dependency");
    });

    test("should handle pipeline with step failures and recovery", async () => {
      const pipeline = new Pipeline();
      const results: string[] = [];

      const step1 = new Step("backup-data", async () => {
        results.push("backup-completed");
        return "backup-success";
      });

      const step2 = new Step("risky-operation", async () => {
        results.push("risky-attempted");
        throw new Error("Operation failed");
      });

      pipeline.addStep(step1);
      pipeline.addStep(step2);

      await expect(pipeline.run("sequential")).rejects.toThrow(
        "Operation failed"
      );

      // Backup should have completed before failure
      expect(results).toContain("backup-completed");
      expect(results).toContain("risky-attempted");
    });
  });

  describe("Performance and Timing Tests", () => {
    test("should demonstrate clear performance benefit of parallel execution", async () => {
      const pipeline = new Pipeline();
      const DELAY = 100;
      const NUM_STEPS = 3;

      // Create steps with consistent delay
      for (let i = 1; i <= NUM_STEPS; i++) {
        const step = new Step(`step-${i}`, async () => {
          await new Promise((resolve) => setTimeout(resolve, DELAY));
          return `result-${i}`;
        });
        pipeline.addStep(step);
      }

      // Test sequential execution
      const sequentialStart = Date.now();
      await pipeline.run("sequential");
      const sequentialEnd = Date.now();
      const sequentialTime = sequentialEnd - sequentialStart;

      // Test parallel execution
      const parallelStart = Date.now();
      await pipeline.run("parallel");
      const parallelEnd = Date.now();
      const parallelTime = parallelEnd - parallelStart;

      // Parallel should be significantly faster
      expect(parallelTime).toBeLessThan(sequentialTime * 0.7);
      expect(sequentialTime).toBeGreaterThanOrEqual(DELAY * NUM_STEPS * 0.9);
      expect(parallelTime).toBeLessThanOrEqual(DELAY * 1.5);
    });
  });
});
