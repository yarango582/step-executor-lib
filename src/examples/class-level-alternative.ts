import 'reflect-metadata';

/**
 * Ejemplo alternativo: Decoradores a nivel de clase con inyección de dependencias
 * (Para comparar con el diseño actual)
 */

// Decorador a nivel de clase
function SequentialClass(target: any) {
    Reflect.defineMetadata('execution:strategy', 'sequential', target);
    return target;
}

function ParallelClass(target: any) {
    Reflect.defineMetadata('execution:strategy', 'parallel', target);
    return target;
}

// Registro de pasos
function RegisterStep(stepName: string) {
    return function(target: any, propertyKey: string) {
        const steps = Reflect.getMetadata('execution:steps', target) || [];
        steps.push({ name: stepName, method: propertyKey });
        Reflect.defineMetadata('execution:steps', steps, target);
    };
}

// Clases con decoradores a nivel de clase
@SequentialClass
class InfrastructureSetup {
    private dbConfig: any = {};
    private networkConfig: any = {};

    @RegisterStep('setup-database')
    async setupDatabase() {
        console.log('🗄️ Setting up database...');
        this.dbConfig = { host: 'db.prod.com', port: 5432 };
        return this.dbConfig;
    }

    @RegisterStep('configure-network')  
    async configureNetwork() {
        console.log('🌐 Configuring network...');
        this.networkConfig = { vpc: 'vpc-123', subnets: ['web', 'app'] };
        return this.networkConfig;
    }

    getConfig() {
        return { db: this.dbConfig, network: this.networkConfig };
    }
}

@ParallelClass
class ServiceDeployment {
    private services: any = {};

    @RegisterStep('deploy-api')
    async deployAPI() {
        console.log('🌐 Deploying API...');
        this.services.api = { port: 3000, status: 'running' };
        return this.services.api;
    }

    @RegisterStep('deploy-web')
    async deployWeb() {
        console.log('🎨 Deploying web app...');
        this.services.web = { port: 3001, status: 'running' };
        return this.services.web;
    }

    getServices() {
        return this.services;
    }
}

@SequentialClass
class VerificationStep {
    @RegisterStep('health-check')
    async healthCheck(infraConfig: any, services: any) {
        console.log('🔍 Running health checks...');
        console.log('Infrastructure:', infraConfig);
        console.log('Services:', services);
        return { status: 'healthy', timestamp: new Date() };
    }
}

// Orquestador con inyección de dependencias
class ClassLevelOrchestrator {
    async execute() {
        console.log('\n🔄 === EJEMPLO: DECORADORES A NIVEL DE CLASE ===\n');

        // 1. Ejecutar infraestructura (secuencial)
        const infraSetup = new InfrastructureSetup();
        await this.executeClass(infraSetup);
        const infraConfig = infraSetup.getConfig();

        // 2. Ejecutar servicios (paralelo)  
        const serviceDeployment = new ServiceDeployment();
        await this.executeClass(serviceDeployment);
        const services = serviceDeployment.getServices();

        // 3. Verificación (secuencial) con dependencias inyectadas
        const verification = new VerificationStep();
        await this.executeClass(verification, [infraConfig, services]);

        console.log('\n✅ Deployment completado con inyección de dependencias');
    }

    private async executeClass(instance: any, dependencies: any[] = []) {
        const strategy = Reflect.getMetadata('execution:strategy', instance.constructor);
        const steps = Reflect.getMetadata('execution:steps', instance.constructor) || [];
        
        console.log(`📋 Ejecutando clase con estrategia: ${strategy}`);
        console.log(`🔧 Pasos: ${steps.map((s: any) => s.name).join(', ')}`);

        if (strategy === 'sequential') {
            for (const step of steps) {
                console.log(`  → Ejecutando: ${step.name}`);
                await instance[step.method](...dependencies);
            }
        } else if (strategy === 'parallel') {
            const promises = steps.map((step: any) => {
                console.log(`  ⚡ Iniciando: ${step.name}`);
                return instance[step.method](...dependencies);
            });
            await Promise.all(promises);
        }
    }
}

export async function runClassLevelExample() {
    const orchestrator = new ClassLevelOrchestrator();
    await orchestrator.execute();
}

// Ejecutar si se corre directamente
if (require.main === module) {
    runClassLevelExample().catch(console.error);
}
