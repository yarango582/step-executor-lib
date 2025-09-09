import { StepRegistry, SharedContext } from './step-registry';
import { Step as StepClass } from './step';

/**
 * Constructor de flujos que permite combinar pasos de diferentes clases
 * como bloques de Lego reutilizables
 */
export class FlowBuilder {
    private steps: Array<{
        name: string;
        parallel: boolean;
        dependencies?: string[];
        condition?: (context: SharedContext) => boolean;
    }> = [];
    
    private context: SharedContext;
    private registry: StepRegistry;

    constructor(context?: SharedContext) {
        this.context = context || new SharedContext();
        this.registry = StepRegistry.getInstance();
    }

    /**
     * Añade un paso secuencial al flujo
     */
    addStep(stepName: string, dependencies?: string[]): FlowBuilder {
        this.steps.push({
            name: stepName,
            parallel: false,
            dependencies
        });
        return this;
    }

    /**
     * Añade un paso paralelo al flujo
     */
    addParallelStep(stepName: string, dependencies?: string[]): FlowBuilder {
        this.steps.push({
            name: stepName,
            parallel: true,
            dependencies
        });
        return this;
    }

    /**
     * Añade múltiples pasos paralelos
     */
    addParallelSteps(stepNames: string[], dependencies?: string[]): FlowBuilder {
        stepNames.forEach(stepName => {
            this.addParallelStep(stepName, dependencies);
        });
        return this;
    }

    /**
     * Añade un paso condicional
     */
    addConditionalStep(
        stepName: string, 
        condition: (context: SharedContext) => boolean,
        dependencies?: string[]
    ): FlowBuilder {
        this.steps.push({
            name: stepName,
            parallel: false,
            dependencies,
            condition
        });
        return this;
    }

    /**
     * Añade un grupo de pasos de una clase específica
     */
    addStepsFromClass(className: string, stepNames?: string[]): FlowBuilder {
        const availableSteps = this.registry.findSteps(className);
        const stepsToAdd = stepNames || availableSteps;
        
        stepsToAdd.forEach(stepName => {
            if (availableSteps.includes(stepName)) {
                this.addStep(stepName);
            }
        });
        return this;
    }

    /**
     * Crea un subflow paralelo
     */
    parallel(builderFunction: (builder: FlowBuilder) => void): FlowBuilder {
        const subBuilder = new FlowBuilder(this.context);
        builderFunction(subBuilder);
        
        // Marcar todos los pasos del subflow como paralelos
        subBuilder.steps.forEach(step => {
            this.steps.push({ ...step, parallel: true });
        });
        
        return this;
    }

    /**
     * Crea un subflow secuencial
     */
    sequential(builderFunction: (builder: FlowBuilder) => void): FlowBuilder {
        const subBuilder = new FlowBuilder(this.context);
        builderFunction(subBuilder);
        
        // Añadir pasos del subflow secuencialmente
        subBuilder.steps.forEach(step => {
            this.steps.push({ ...step, parallel: false });
        });
        
        return this;
    }

    /**
     * Ejecuta el flujo construido
     */
    async execute(): Promise<void> {
        console.log('\n🔄 === EJECUTANDO FLUJO CONSTRUIDO ===\n');
        console.log(`📋 Total de pasos: ${this.steps.length}`);
        
        // Agrupar pasos consecutivos por tipo (secuencial/paralelo)
        const groups = this.groupSteps();
        
        for (const group of groups) {
            if (group.parallel) {
                await this.executeParallelGroup(group.steps);
            } else {
                await this.executeSequentialGroup(group.steps);
            }
        }
        
        console.log('\n✅ Flujo completado exitosamente');
    }

    /**
     * Obtiene el contexto compartido
     */
    getContext(): SharedContext {
        return this.context;
    }

    /**
     * Lista todos los pasos del flujo
     */
    getSteps(): string[] {
        return this.steps.map(step => step.name);
    }

    /**
     * Valida que todos los pasos existen en el registro
     */
    validate(): boolean {
        const missingSteps = this.steps
            .filter(step => !this.registry.getStep(step.name))
            .map(step => step.name);
            
        if (missingSteps.length > 0) {
            console.error('❌ Pasos no encontrados:', missingSteps);
            return false;
        }
        
        console.log('✅ Todos los pasos están registrados');
        return true;
    }

    private groupSteps() {
        const groups: Array<{ parallel: boolean; steps: any[] }> = [];
        let currentGroup: any = null;
        
        for (const step of this.steps) {
            if (!currentGroup || currentGroup.parallel !== step.parallel) {
                currentGroup = { parallel: step.parallel, steps: [] };
                groups.push(currentGroup);
            }
            currentGroup.steps.push(step);
        }
        
        return groups;
    }

    private async executeSequentialGroup(steps: any[]): Promise<void> {
        console.log(`🔄 Ejecutando grupo secuencial: ${steps.map(s => s.name).join(' → ')}`);
        
        for (const step of steps) {
            await this.executeStep(step);
        }
    }

    private async executeParallelGroup(steps: any[]): Promise<void> {
        console.log(`⚡ Ejecutando grupo paralelo: ${steps.map(s => s.name).join(' | ')}`);
        
        const promises = steps.map(step => this.executeStep(step));
        await Promise.all(promises);
    }

    private async executeStep(stepConfig: any): Promise<void> {
        // Verificar condición si existe
        if (stepConfig.condition && !stepConfig.condition(this.context)) {
            console.log(`⏭️  Saltando paso ${stepConfig.name} (condición no cumplida)`);
            return;
        }

        // Verificar dependencias
        if (stepConfig.dependencies) {
            const missingDeps = stepConfig.dependencies.filter((dep: string) => !this.context.has(dep));
            if (missingDeps.length > 0) {
                throw new Error(`Dependencias faltantes para ${stepConfig.name}: ${missingDeps.join(', ')}`);
            }
        }

        const registeredStep = this.registry.getStep(stepConfig.name);
        if (!registeredStep) {
            throw new Error(`Paso no registrado: ${stepConfig.name}`);
        }

        try {
            console.log(`  🔹 Ejecutando: ${stepConfig.name}`);
            const result = await registeredStep.instance[registeredStep.method](this.context);
            
            // Almacenar resultado en el contexto si se devuelve algo
            if (result !== undefined) {
                this.context.set(`result.${stepConfig.name}`, result);
            }
            
        } catch (error) {
            console.error(`❌ Error en paso ${stepConfig.name}:`, error);
            throw error;
        }
    }
}

/**
 * Factory para crear flujos predefinidos comunes
 */
export class FlowTemplates {
    static cicdPipeline(): FlowBuilder {
        return new FlowBuilder()
            .addStep('git.checkout')
            .addStep('build.compile')
            .addParallelSteps(['test.unit', 'test.integration', 'security.scan'])
            .addStep('docker.build')
            .addStep('deploy.staging')
            .addStep('test.e2e')
            .addStep('deploy.production');
    }

    static microservicesDeployment(): FlowBuilder {
        return new FlowBuilder()
            // Infraestructura secuencial
            .sequential(builder => {
                builder
                    .addStep('infra.setup-vpc')
                    .addStep('infra.setup-database')
                    .addStep('infra.run-migrations');
            })
            // Servicios en paralelo
            .parallel(builder => {
                builder
                    .addStep('services.deploy-auth')
                    .addStep('services.deploy-api')
                    .addStep('services.deploy-notifications')
                    .addStep('services.deploy-payments');
            })
            // Verificación final
            .addStep('health.check-all');
    }

    static dataProcessingPipeline(): FlowBuilder {
        return new FlowBuilder()
            .addStep('data.extract')
            .parallel(builder => {
                builder
                    .addStep('data.validate-schema')
                    .addStep('data.clean-duplicates')
                    .addStep('data.enrich-data');
            })
            .addStep('data.transform')
            .addStep('data.load')
            .addConditionalStep(
                'data.send-notification',
                (context) => context.get('data.errors') === 0
            );
    }
}
