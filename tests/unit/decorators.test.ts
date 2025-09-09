import "reflect-metadata";
import {
  Step as StepDecorator,
  getSteps,
} from "../../src/decorators/step.decorator";
import { Parallel } from "../../src/decorators/parallel.decorator";

describe("Decorators", () => {
  describe("Step Decorator", () => {
    test("should add metadata to methods", () => {
      class TestClass {
        @StepDecorator("test-step")
        testMethod() {
          return "test result";
        }

        @StepDecorator("another-step")
        anotherMethod() {
          return "another result";
        }
      }

      const instance = new TestClass();
      const steps = getSteps(instance);

      expect(steps).toHaveLength(2);
      expect(steps).toContainEqual({ name: "test-step", method: "testMethod" });
      expect(steps).toContainEqual({
        name: "another-step",
        method: "anotherMethod",
      });
    });

    test("should handle class with no decorated methods", () => {
      class EmptyClass {
        regularMethod() {
          return "regular";
        }
      }

      const instance = new EmptyClass();
      const steps = getSteps(instance);

      expect(steps).toEqual([]);
    });
  });

  describe("Parallel Decorator", () => {
    test("should mark methods for parallel execution", () => {
      class TestClass {
        @Parallel()
        parallelMethod1() {
          return "parallel1";
        }

        @Parallel()
        parallelMethod2() {
          return "parallel2";
        }

        regularMethod() {
          return "regular";
        }
      }

      const instance = new TestClass();

      expect((instance as any).parallelSteps).toContain("parallelMethod1");
      expect((instance as any).parallelSteps).toContain("parallelMethod2");
      expect((instance as any).parallelSteps).not.toContain("regularMethod");
    });

    test("should initialize parallelSteps array if not exists", () => {
      class TestClass {
        @Parallel()
        firstParallelMethod() {
          return "parallel";
        }
      }

      const instance = new TestClass();

      expect((instance as any).parallelSteps).toBeDefined();
      expect((instance as any).parallelSteps).toBeInstanceOf(Array);
      expect((instance as any).parallelSteps).toHaveLength(1);
    });
  });
});
