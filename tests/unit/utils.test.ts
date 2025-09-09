import { handleError, logErrorToService } from "../../src/utils/error-handler";
import {
  logInfo,
  logError,
  logWarn,
  logDebug,
  logger,
  LogLevel,
} from "../../src/utils/logger";

describe("Utils", () => {
  describe("Error Handler", () => {
    test("should handle error and log to console", () => {
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();
      const error = new Error("Test error");

      handleError(error);

      expect(consoleSpy).toHaveBeenCalledWith(
        "An error occurred:",
        "Test error"
      );
      consoleSpy.mockRestore();
    });

    test("should log error to service", () => {
      const error = new Error("Service error");

      // This function is a placeholder, so we just test it doesn't throw
      expect(() => logErrorToService(error)).not.toThrow();
    });
  });

  describe("Logger", () => {
    let consoleSpy: jest.SpyInstance;

    beforeEach(() => {
      consoleSpy = jest.spyOn(console, "log").mockImplementation();
    });

    afterEach(() => {
      consoleSpy.mockRestore();
    });

    test("should log info messages", () => {
      logInfo("Test info message");

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringMatching(
          /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z \[INFO\]: Test info message/
        )
      );
    });

    test("should log error messages", () => {
      logError("Test error message");

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringMatching(
          /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z \[ERROR\]: Test error message/
        )
      );
    });

    test("should log warn messages", () => {
      logWarn("Test warning message");

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringMatching(
          /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z \[WARN\]: Test warning message/
        )
      );
    });

    test("should log debug messages", () => {
      logger.setLevel(LogLevel.DEBUG); // Ensure debug level is enabled
      logDebug("Test debug message");

      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringMatching(
          /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z \[DEBUG\]: Test debug message/
        )
      );
    });

    test("should respect log levels", () => {
      logger.setLevel(LogLevel.ERROR);

      logError("Error message");
      logInfo("Info message");

      expect(consoleSpy).toHaveBeenCalledTimes(1);
      expect(consoleSpy).toHaveBeenCalledWith(
        expect.stringMatching(/\[ERROR\]: Error message/)
      );
    });

    test("should log all levels when set to DEBUG", () => {
      logger.setLevel(LogLevel.DEBUG);

      logError("Error message");
      logWarn("Warn message");
      logInfo("Info message");
      logDebug("Debug message");

      expect(consoleSpy).toHaveBeenCalledTimes(4);
    });
  });
});
