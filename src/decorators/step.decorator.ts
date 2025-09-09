import 'reflect-metadata';

const STEP_METADATA_KEY = Symbol('stepMetadata');

// Type-safe decorator that works with both legacy and modern TypeScript
export function Step(name: string): <T extends Function>(target: any, propertyKey: string | symbol, descriptor?: TypedPropertyDescriptor<T>) => TypedPropertyDescriptor<T> | void {
    return function <T extends Function>(target: any, propertyKey: string | symbol, descriptor?: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> | void {
        const existingSteps = (Reflect as any).getMetadata(STEP_METADATA_KEY, target) || [];
        existingSteps.push({ name, method: propertyKey });
        (Reflect as any).defineMetadata(STEP_METADATA_KEY, existingSteps, target);
        return descriptor;
    };
}

export function getSteps(target: any) {
    return (Reflect as any).getMetadata(STEP_METADATA_KEY, target) || [];
}