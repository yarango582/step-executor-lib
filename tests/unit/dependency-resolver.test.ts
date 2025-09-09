import { DependencyResolver } from "../../src/utils/dependency-resolver";
import { Step } from "../../src/core/step";

describe("DependencyResolver", () => {
  test("should resolve dependencies in correct order", () => {
    const resolver = new DependencyResolver();

    const stepA = new Step("A", async () => "A result");
    const stepB = new Step("B", async () => "B result");
    const stepC = new Step("C", async () => "C result");

    // A depends on nothing
    resolver.addStep(stepA, []);

    // B depends on A
    resolver.addStep(stepB, ["A"]);

    // C depends on B
    resolver.addStep(stepC, ["B"]);

    const order = resolver.resolveOrder();

    expect(order.indexOf("A")).toBeLessThan(order.indexOf("B"));
    expect(order.indexOf("B")).toBeLessThan(order.indexOf("C"));
  });

  test("should handle complex dependency graph", () => {
    const resolver = new DependencyResolver();

    const steps = [
      new Step("database", async () => "DB ready"),
      new Step("api", async () => "API ready"),
      new Step("cache", async () => "Cache ready"),
      new Step("frontend", async () => "Frontend ready"),
    ];

    // database has no dependencies
    resolver.addStep(steps[0], []);

    // api depends on database
    resolver.addStep(steps[1], ["database"]);

    // cache depends on database
    resolver.addStep(steps[2], ["database"]);

    // frontend depends on api and cache
    resolver.addStep(steps[3], ["api", "cache"]);

    const order = resolver.resolveOrder();

    expect(order.indexOf("database")).toBe(0);
    expect(order.indexOf("api")).toBeGreaterThan(order.indexOf("database"));
    expect(order.indexOf("cache")).toBeGreaterThan(order.indexOf("database"));
    expect(order.indexOf("frontend")).toBeGreaterThan(order.indexOf("api"));
    expect(order.indexOf("frontend")).toBeGreaterThan(order.indexOf("cache"));
  });

  test("should detect circular dependencies", () => {
    const resolver = new DependencyResolver();

    const stepA = new Step("A", async () => "A result");
    const stepB = new Step("B", async () => "B result");

    // Create circular dependency: A -> B -> A
    resolver.addStep(stepA, ["B"]);
    resolver.addStep(stepB, ["A"]);

    expect(() => resolver.resolveOrder()).toThrow("Circular dependency");
  });

  test("should handle multiple independent chains", () => {
    const resolver = new DependencyResolver();

    const steps = [
      new Step("auth-db", async () => "Auth DB ready"),
      new Step("auth-service", async () => "Auth Service ready"),
      new Step("user-db", async () => "User DB ready"),
      new Step("user-service", async () => "User Service ready"),
    ];

    // Auth chain
    resolver.addStep(steps[0], []);
    resolver.addStep(steps[1], ["auth-db"]);

    // User chain
    resolver.addStep(steps[2], []);
    resolver.addStep(steps[3], ["user-db"]);

    const order = resolver.resolveOrder();

    // Check auth chain order
    expect(order.indexOf("auth-db")).toBeLessThan(
      order.indexOf("auth-service")
    );

    // Check user chain order
    expect(order.indexOf("user-db")).toBeLessThan(
      order.indexOf("user-service")
    );

    // Should include all steps
    expect(order).toContain("auth-db");
    expect(order).toContain("auth-service");
    expect(order).toContain("user-db");
    expect(order).toContain("user-service");
  });

  test("should handle empty dependency list", () => {
    const resolver = new DependencyResolver();

    const stepA = new Step("standalone", async () => "Standalone result");
    resolver.addStep(stepA, []);

    const order = resolver.resolveOrder();
    expect(order).toEqual(["standalone"]);
  });
});
