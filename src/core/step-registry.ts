import 'reflect-metadata';

/**
 * Registro global de pasos reutilizables
 * Permite registrar pasos de cualquier clase y reutilizarlos
 */
export class StepRegistry {
    private static instance: StepRegistry;
    private steps: Map<string, {
        instance: any;
        method: string;
        metadata: any;
    }> = new Map();

    private constructor() {}

    static getInstance(): StepRegistry {
        if (!StepRegistry.instance) {
            StepRegistry.instance = new StepRegistry();
        }
        return StepRegistry.instance;
    }

    /**
     * Registra una instancia completa con todos sus pasos decorados
     */
    registerInstance<T>(instance: T, prefix?: string): void {
        const constructor = instance!.constructor;
        const stepMetadata = Reflect.getMetadata('steps', constructor) || [];
        
        for (const step of stepMetadata) {
            // El step.name ya incluye el prefijo del decorador, no duplicar
            const stepName = step.name;
            this.steps.set(stepName, {
                instance,
                method: step.method,
                metadata: step
            });
            
            console.log(`📝 Registrado: ${stepName} -> ${constructor.name}.${step.method}`);
        }
    }

    /**
     * Registra un paso específico de una instancia
     */
    registerStep<T>(stepName: string, instance: T, methodName: string): void {
        this.steps.set(stepName, {
            instance,
            method: methodName,
            metadata: { name: stepName, parallel: false }
        });
        
        console.log(`📝 Registrado paso individual: ${stepName}`);
    }

    /**
     * Obtiene un paso registrado
     */
    getStep(stepName: string) {
        return this.steps.get(stepName);
    }

    /**
     * Lista todos los pasos disponibles
     */
    listSteps(): string[] {
        return Array.from(this.steps.keys());
    }

    /**
     * Busca pasos por patrón
     */
    findSteps(pattern: string): string[] {
        return Array.from(this.steps.keys())
            .filter(name => name.includes(pattern));
    }

    /**
     * Limpia el registro (útil para tests)
     */
    clear(): void {
        this.steps.clear();
    }
}

/**
 * Context compartido entre todos los pasos
 * Permite compartir datos entre clases diferentes
 */
export class SharedContext {
    private data: Map<string, any> = new Map();
    private listeners: Map<string, Function[]> = new Map();

    /**
     * Establece un valor en el contexto
     */
    set<T>(key: string, value: T): void {
        const oldValue = this.data.get(key);
        this.data.set(key, value);
        
        // Notificar a los listeners
        const keyListeners = this.listeners.get(key) || [];
        keyListeners.forEach(listener => listener(value, oldValue));
        
        console.log(`📦 Context[${key}] = ${JSON.stringify(value)}`);
    }

    /**
     * Obtiene un valor del contexto
     */
    get<T>(key: string): T | undefined {
        return this.data.get(key);
    }

    /**
     * Obtiene un valor o lanza error si no existe
     */
    require<T>(key: string): T {
        const value = this.data.get(key);
        if (value === undefined) {
            throw new Error(`Required context key '${key}' not found`);
        }
        return value;
    }

    /**
     * Verifica si existe una clave
     */
    has(key: string): boolean {
        return this.data.has(key);
    }

    /**
     * Establece múltiples valores
     */
    setMany(values: Record<string, any>): void {
        Object.entries(values).forEach(([key, value]) => {
            this.set(key, value);
        });
    }

    /**
     * Obtiene múltiples valores
     */
    getMany<T extends Record<string, any>>(keys: string[]): Partial<T> {
        const result: any = {};
        keys.forEach(key => {
            if (this.has(key)) {
                result[key] = this.get(key);
            }
        });
        return result;
    }

    /**
     * Escucha cambios en una clave
     */
    onChange(key: string, listener: Function): void {
        if (!this.listeners.has(key)) {
            this.listeners.set(key, []);
        }
        this.listeners.get(key)!.push(listener);
    }

    /**
     * Obtiene todas las claves disponibles
     */
    keys(): string[] {
        return Array.from(this.data.keys());
    }

    /**
     * Obtiene un snapshot del contexto
     */
    snapshot(): Record<string, any> {
        const result: Record<string, any> = {};
        this.data.forEach((value, key) => {
            result[key] = value;
        });
        return result;
    }

    /**
     * Limpia el contexto
     */
    clear(): void {
        this.data.clear();
        this.listeners.clear();
    }
}

/**
 * Decorador mejorado que registra automáticamente los pasos
 */
export function Step(name: string, autoRegister: boolean = false) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        // Metadata existente
        const existingSteps = Reflect.getMetadata('steps', target.constructor) || [];
        const stepInfo = { name, method: propertyKey, parallel: false };
        existingSteps.push(stepInfo);
        Reflect.defineMetadata('steps', existingSteps, target.constructor);

        if (autoRegister) {
            // Auto-registrar cuando se crea una instancia
            const originalMethod = descriptor.value;
            descriptor.value = function (...args: any[]) {
                const registry = StepRegistry.getInstance();
                if (!registry.getStep(name)) {
                    registry.registerStep(name, this, propertyKey);
                }
                return originalMethod.apply(this, args);
            };
        }

        return descriptor;
    };
}
