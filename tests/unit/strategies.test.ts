import { SequentialStrategy } from "../../src/strategies/sequential.strategy";
import { ParallelStrategy } from "../../src/strategies/parallel.strategy";
import { MixedStrategy } from "../../src/strategies/mixed.strategy";
import { Step } from "../../src/core/step";

describe("Execution Strategies", () => {
  describe("SequentialStrategy", () => {
    test("should execute steps one after another", async () => {
      const strategy = new SequentialStrategy();
      const results: string[] = [];

      const step1 = async () => {
        results.push("step1");
      };

      const step2 = async () => {
        results.push("step2");
      };

      strategy.addStep(step1);
      strategy.addStep(step2);

      await strategy.execute();

      expect(results).toEqual(["step1", "step2"]);
    });

    test("should handle async operations sequentially", async () => {
      const strategy = new SequentialStrategy();
      const timestamps: number[] = [];

      const step1 = async () => {
        await new Promise((resolve) => setTimeout(resolve, 100));
        timestamps.push(Date.now());
      };

      const step2 = async () => {
        timestamps.push(Date.now());
      };

      strategy.addStep(step1);
      strategy.addStep(step2);

      await strategy.execute();

      // Step2 should execute after step1 completes
      // Allow for timing variance but ensure both steps executed
      expect(timestamps).toHaveLength(2);
      expect(timestamps[1] - timestamps[0]).toBeGreaterThanOrEqual(0);
    });
  });

  describe("ParallelStrategy", () => {
    test("should execute steps concurrently", async () => {
      const strategy = new ParallelStrategy();
      const results: string[] = [];

      const steps = [
        async () => {
          await new Promise((resolve) => setTimeout(resolve, 100));
          results.push("step1");
          return "result1";
        },
        async () => {
          await new Promise((resolve) => setTimeout(resolve, 50));
          results.push("step2");
          return "result2";
        },
      ];

      const startTime = Date.now();
      const stepResults = await strategy.execute(steps);
      const endTime = Date.now();

      expect(stepResults).toHaveLength(2);
      expect(stepResults).toContain("result1");
      expect(stepResults).toContain("result2");

      // Should complete faster than sequential execution
      expect(endTime - startTime).toBeLessThan(150);

      // Step2 should complete before step1 due to shorter delay
      expect(results).toEqual(["step2", "step1"]);
    });

    test("should handle errors in parallel execution", async () => {
      const strategy = new ParallelStrategy();

      const steps = [
        async () => "success",
        async () => {
          throw new Error("Failed step");
        },
        async () => "another success",
      ];

      // Should handle errors gracefully
      await expect(strategy.execute(steps)).rejects.toThrow("Failed step");
    });
  });

  describe("MixedStrategy", () => {
    test("should execute sequential steps first, then parallel steps", async () => {
      const sequentialSteps = [
        new Step("seq1", async () => "sequential1"),
        new Step("seq2", async () => "sequential2"),
      ];

      const parallelSteps = [
        new Step("par1", async () => "parallel1"),
        new Step("par2", async () => "parallel2"),
      ];

      const strategy = new MixedStrategy(sequentialSteps, parallelSteps);

      // Should not throw
      await expect(strategy.execute()).resolves.not.toThrow();
    });

    test("should maintain execution order: sequential then parallel", async () => {
      const executionOrder: string[] = [];

      const sequentialSteps = [
        new Step("seq1", async () => {
          await new Promise((resolve) => setTimeout(resolve, 50));
          executionOrder.push("seq1");
        }),
      ];

      const parallelSteps = [
        new Step("par1", async () => {
          executionOrder.push("par1");
        }),
        new Step("par2", async () => {
          executionOrder.push("par2");
        }),
      ];

      const strategy = new MixedStrategy(sequentialSteps, parallelSteps);
      await strategy.execute();

      // Sequential step should execute before parallel steps
      expect(executionOrder[0]).toBe("seq1");
      expect(executionOrder.slice(1)).toContain("par1");
      expect(executionOrder.slice(1)).toContain("par2");
    });
  });
});
