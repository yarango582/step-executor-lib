import { Pipeline } from "../../src/core/pipeline";
import { Step } from "../../src/core/step";

describe("Pipeline", () => {
  test("should add steps to pipeline", () => {
    const pipeline = new Pipeline();
    const step = new Step("test-step", async () => "result");

    pipeline.addStep(step);

    // Pipeline should accept the step without error
    expect(pipeline).toBeInstanceOf(Pipeline);
  });

  test("should run steps sequentially", async () => {
    const pipeline = new Pipeline();
    const executionOrder: string[] = [];

    const step1 = new Step("step1", async () => {
      executionOrder.push("step1");
      return "result1";
    });

    const step2 = new Step("step2", async () => {
      executionOrder.push("step2");
      return "result2";
    });

    pipeline.addStep(step1);
    pipeline.addStep(step2);

    await pipeline.run("sequential");

    expect(executionOrder).toEqual(["step1", "step2"]);
  });

  test("should run steps in parallel", async () => {
    const pipeline = new Pipeline();
    const results: string[] = [];

    const step1 = new Step("step1", async () => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      results.push("step1");
      return "result1";
    });

    const step2 = new Step("step2", async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      results.push("step2");
      return "result2";
    });

    pipeline.addStep(step1);
    pipeline.addStep(step2);

    const startTime = Date.now();
    await pipeline.run("parallel");
    const endTime = Date.now();

    // Should complete faster than sequential execution
    expect(endTime - startTime).toBeLessThan(150);

    // Step2 should complete before step1
    expect(results).toEqual(["step2", "step1"]);
  });

  test("should handle empty pipeline", async () => {
    const pipeline = new Pipeline();

    // Should not throw when running empty pipeline
    await expect(pipeline.run("sequential")).resolves.not.toThrow();
    await expect(pipeline.run("parallel")).resolves.not.toThrow();
  });

  test("should handle step errors in sequential mode", async () => {
    const pipeline = new Pipeline();
    const executionOrder: string[] = [];

    const step1 = new Step("step1", async () => {
      executionOrder.push("step1");
      return "result1";
    });

    const step2 = new Step("step2", async () => {
      executionOrder.push("step2");
      throw new Error("Step 2 failed");
    });

    const step3 = new Step("step3", async () => {
      executionOrder.push("step3");
      return "result3";
    });

    pipeline.addStep(step1);
    pipeline.addStep(step2);
    pipeline.addStep(step3);

    await expect(pipeline.run("sequential")).rejects.toThrow("Step 2 failed");

    // Only step1 should have executed before the error
    expect(executionOrder).toEqual(["step1", "step2"]);
  });

  test("should handle step errors in parallel mode", async () => {
    const pipeline = new Pipeline();
    const results: string[] = [];

    const step1 = new Step("step1", async () => {
      results.push("step1");
      return "result1";
    });

    const step2 = new Step("step2", async () => {
      results.push("step2");
      throw new Error("Step 2 failed");
    });

    const step3 = new Step("step3", async () => {
      results.push("step3");
      return "result3";
    });

    pipeline.addStep(step1);
    pipeline.addStep(step2);
    pipeline.addStep(step3);

    await expect(pipeline.run("parallel")).rejects.toThrow("Step 2 failed");

    // All steps should have attempted to execute
    expect(results).toContain("step1");
    expect(results).toContain("step2");
    expect(results).toContain("step3");
  });
});
