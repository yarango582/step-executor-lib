import { Executor } from "../../src/core/executor";

describe("Executor", () => {
  test("should create executor with default sequential strategy", () => {
    const executor = new Executor();
    expect(executor).toBeInstanceOf(Executor);
  });

  test("should create executor with specified strategy", () => {
    const executor = new Executor("parallel");
    expect(executor).toBeInstanceOf(Executor);
  });

  test("should register and execute steps sequentially", async () => {
    const executor = new Executor("sequential");
    const results: string[] = [];

    executor.registerStep("step1", async () => {
      results.push("step1");
    });

    executor.registerStep("step2", async () => {
      results.push("step2");
    });

    await executor.execute(["step1", "step2"]);
    expect(results).toEqual(["step1", "step2"]);
  });

  test("should execute steps in parallel", async () => {
    const executor = new Executor("parallel");
    const results: string[] = [];
    let step1Started = false;
    let step2Started = false;

    executor.registerStep("step1", async () => {
      step1Started = true;
      await new Promise((resolve) => setTimeout(resolve, 100));
      results.push("step1");
    });

    executor.registerStep("step2", async () => {
      step2Started = true;
      await new Promise((resolve) => setTimeout(resolve, 50));
      results.push("step2");
    });

    const startTime = Date.now();
    await executor.execute(["step1", "step2"]);
    const endTime = Date.now();

    // Both steps should have started
    expect(step1Started).toBe(true);
    expect(step2Started).toBe(true);

    // Step2 should finish before step1 due to shorter timeout
    expect(results).toEqual(["step2", "step1"]);

    // Total time should be less than sum of individual times (indicates parallel execution)
    expect(endTime - startTime).toBeLessThan(150);
  });

  test("should handle non-existent steps gracefully", async () => {
    const executor = new Executor();

    executor.registerStep("existingStep", async () => {
      return "executed";
    });

    // This should not throw, just skip non-existent steps
    await expect(
      executor.execute(["existingStep", "nonExistentStep"])
    ).resolves.not.toThrow();
  });

  test("should handle mixed strategy (placeholder)", async () => {
    const executor = new Executor("mixed");

    executor.registerStep("step1", async () => {
      return "step1 result";
    });

    // Mixed strategy is not fully implemented yet, but should not throw
    await expect(executor.execute(["step1"])).resolves.not.toThrow();
  });

  test("should execute steps with return values", async () => {
    const executor = new Executor();
    let capturedResult: any;

    executor.registerStep("dataStep", async () => {
      return { data: "test result", timestamp: Date.now() };
    });

    executor.registerStep("processingStep", async () => {
      capturedResult = "processed";
    });

    await executor.execute(["dataStep", "processingStep"]);
    expect(capturedResult).toBe("processed");
  });
});
