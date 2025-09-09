import { Step } from "../../src/core/step";

describe("Step Class", () => {
  test("should create a step with a name and execute function", () => {
    const step = new Step("Test Step", async () => {
      return "Step executed";
    });

    expect(step.name).toBe("Test Step");
    expect(typeof step.execute).toBe("function");
  });

  test("should execute the step and return the result", async () => {
    const step = new Step("Test Step", async () => {
      return "Step executed successfully";
    });

    const result = await step.execute();
    expect(result).toBe("Step executed successfully");
  });

  test("should execute the step via run method with logging", async () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation();

    const step = new Step("Test Step", async () => {
      return "Step result";
    });

    const result = await step.run();
    expect(result).toBe("Step result");
    expect(consoleSpy).toHaveBeenCalledWith("Executing step: Test Step");
    expect(consoleSpy).toHaveBeenCalledWith(
      "Step Test Step completed successfully."
    );

    consoleSpy.mockRestore();
  });

  test("should handle errors during execution", async () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

    const step = new Step("Failing Step", async () => {
      throw new Error("Step failed");
    });

    await expect(step.run()).rejects.toThrow("Step failed");
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error executing step Failing Step:",
      expect.any(Error)
    );

    consoleErrorSpy.mockRestore();
  });

  test("should execute async operations correctly", async () => {
    const step = new Step("Async Step", async () => {
      await new Promise((resolve) => setTimeout(resolve, 10));
      return "Async completed";
    });

    const result = await step.execute();
    expect(result).toBe("Async completed");
  });
});
