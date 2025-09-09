// Type-safe decorator that works with both legacy and modern TypeScript
export function Parallel(): <T extends Function>(target: any, propertyKey: string | symbol, descriptor?: TypedPropertyDescriptor<T>) => TypedPropertyDescriptor<T> | void {
    return function <T extends Function>(target: any, propertyKey: string | symbol, descriptor?: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> | void {
        // Mark the method as parallel executable
        if (!target.parallelSteps) {
            target.parallelSteps = [];
        }
        target.parallelSteps.push(propertyKey);
        return descriptor;
    };
}