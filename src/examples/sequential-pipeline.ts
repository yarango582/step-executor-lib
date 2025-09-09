import 'reflect-metadata';
import { Step as StepDecorator, getSteps } from '../decorators/step.decorator';
import { Executor } from '../core/executor';
import { DependencyResolver } from '../utils/dependency-resolver';
import { Step } from '../core/step';

// Clase para manejo de código fuente
export class SourceManager {
    private buildArtifacts: any = {};
    
    @StepDecorator('checkout')
    async checkout(): Promise<{ code: string; version: string }> {
        console.log('🔄 Checking out code from repository...');
        await this.simulate(500);
        const result = { code: 'source-code-v1.2.3', version: '1.2.3' };
        console.log('✅ Code checked out successfully');
        return result;
    }

    @StepDecorator('build')
    async build(): Promise<{ artifacts: string[]; buildId: string }> {
        console.log('🔨 Building application...');
        await this.simulate(1000);
        this.buildArtifacts = {
            artifacts: ['app.jar', 'config.yml', 'docker-image:v1.2.3'],
            buildId: 'build-12345'
        };
        console.log('✅ Build completed successfully');
        return this.buildArtifacts;
    }

    getBuildArtifacts() {
        return this.buildArtifacts;
    }

    private async simulate(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Clase para pruebas
export class TestManager {
    private testResults: any = {};

    @StepDecorator('unit-tests')
    async runUnitTests(): Promise<{ passed: number; failed: number; coverage: string }> {
        console.log('🧪 Running unit tests...');
        await this.simulate(800);
        this.testResults.unit = { passed: 42, failed: 0, coverage: '95%' };
        console.log('✅ Unit tests passed');
        return this.testResults.unit;
    }

    @StepDecorator('integration-tests')
    async runIntegrationTests(): Promise<{ status: string; duration: string }> {
        console.log('🔗 Running integration tests...');
        await this.simulate(1200);
        this.testResults.integration = { status: 'passed', duration: '2m 30s' };
        console.log('✅ Integration tests passed');
        return this.testResults.integration;
    }

    getTestResults() {
        return this.testResults;
    }

    private async simulate(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Clase para deployment
export class DeploymentManager {
    private deploymentInfo: any = {};

    @StepDecorator('deploy-staging')
    async deployToStaging(artifacts: any): Promise<{ url: string; status: string }> {
        console.log('🚀 Deploying to staging environment...');
        await this.simulate(1500);
        this.deploymentInfo.staging = {
            url: 'https://staging.myapp.com',
            status: 'deployed',
            artifacts
        };
        console.log('✅ Deployed to staging successfully');
        return this.deploymentInfo.staging;
    }

    @StepDecorator('deploy-production')
    async deployToProduction(artifacts: any): Promise<{ url: string; status: string }> {
        console.log('🌍 Deploying to production environment...');
        await this.simulate(2000);
        this.deploymentInfo.production = {
            url: 'https://myapp.com',
            status: 'deployed',
            artifacts
        };
        console.log('✅ Deployed to production successfully');
        return this.deploymentInfo.production;
    }

    private async simulate(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Función principal para ejecutar el pipeline secuencial
export async function runSequentialPipeline() {
    console.log('\n🔄 === PIPELINE SECUENCIAL CI/CD ===\n');

    const sourceManager = new SourceManager();
    const testManager = new TestManager();
    const deploymentManager = new DeploymentManager();

    // Configurar executor y resolver de dependencias
    const executor = new Executor('sequential');
    const resolver = new DependencyResolver();

    // Crear instancias de Step para cada método decorado
    const checkoutStep = new Step('checkout', () => sourceManager.checkout());
    const buildStep = new Step('build', () => sourceManager.build());
    const unitTestsStep = new Step('unit-tests', () => testManager.runUnitTests());
    const integrationTestsStep = new Step('integration-tests', () => testManager.runIntegrationTests());
    const deployStagingStep = new Step('deploy-staging', () => 
        deploymentManager.deployToStaging(sourceManager.getBuildArtifacts())
    );
    const deployProductionStep = new Step('deploy-production', () => 
        deploymentManager.deployToProduction(sourceManager.getBuildArtifacts())
    );

    // Configurar dependencias
    resolver.addStep(checkoutStep, []);
    resolver.addStep(buildStep, ['checkout']);
    resolver.addStep(unitTestsStep, ['build']);
    resolver.addStep(integrationTestsStep, ['unit-tests']);
    resolver.addStep(deployStagingStep, ['integration-tests']);
    resolver.addStep(deployProductionStep, ['deploy-staging']);

    // Obtener orden de ejecución
    const executionOrder = resolver.resolveOrder();
    console.log('📋 Orden de ejecución:', executionOrder);

    // Registrar steps en el executor
    executor.registerStep('checkout', checkoutStep.execute.bind(checkoutStep));
    executor.registerStep('build', buildStep.execute.bind(buildStep));
    executor.registerStep('unit-tests', unitTestsStep.execute.bind(unitTestsStep));
    executor.registerStep('integration-tests', integrationTestsStep.execute.bind(integrationTestsStep));
    executor.registerStep('deploy-staging', deployStagingStep.execute.bind(deployStagingStep));
    executor.registerStep('deploy-production', deployProductionStep.execute.bind(deployProductionStep));

    // Ejecutar pipeline
    const startTime = Date.now();
    try {
        await executor.execute(executionOrder);
        const endTime = Date.now();
        console.log(`\n🎉 Pipeline completado en ${endTime - startTime}ms`);
        console.log('📊 Resultados:', {
            artifacts: sourceManager.getBuildArtifacts(),
            tests: testManager.getTestResults()
        });
    } catch (error) {
        console.error('❌ Pipeline falló:', error);
    }
}

// Ejecutar si se corre directamente
if (require.main === module) {
    runSequentialPipeline().catch(console.error);
}
