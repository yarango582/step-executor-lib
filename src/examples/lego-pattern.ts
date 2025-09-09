import "reflect-metadata";
import { Step } from "../core/step-registry";
import { SharedContext, StepRegistry } from "../core/step-registry";
import { FlowBuilder, FlowTemplates } from "../core/flow-builder";

/**
 * Clase reutilizable para operaciones de Git
 */
export class GitOperations {
  @Step("git.checkout")
  async checkout(context: SharedContext): Promise<void> {
    console.log("📥 Checking out code from repository...");
    await this.simulate(500);

    const repoInfo = {
      branch: "main",
      commit: "abc123def456",
      timestamp: new Date().toISOString(),
    };

    context.set("git.info", repoInfo);
    context.set("source.available", true);
    console.log("✅ Code checked out successfully");
  }

  @Step("git.tag-release")
  async tagRelease(context: SharedContext): Promise<void> {
    const buildInfo = context.require("build.info") as any;
    console.log(`🏷️  Tagging release v${buildInfo.version}...`);
    await this.simulate(300);

    context.set("git.tag", `v${buildInfo.version}`);
    console.log("✅ Release tagged successfully");
  }

  private async simulate(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

/**
 * Clase reutilizable para operaciones de build
 */
export class BuildOperations {
  @Step("build.compile")
  async compile(context: SharedContext): Promise<void> {
    // Requiere que el código esté disponible
    context.require("source.available");

    console.log("🔨 Compiling application...");
    await this.simulate(1000);

    const buildInfo = {
      version: "1.2.3",
      artifacts: ["app.jar", "config.yml"],
      buildId: `build-${Date.now()}`,
    };

    context.set("build.info", buildInfo);
    context.set("build.completed", true);
    console.log("✅ Compilation completed");
  }

  @Step("build.docker")
  async buildDocker(context: SharedContext): Promise<void> {
    const buildInfo = context.require("build.info") as any;
    console.log(`🐳 Building Docker image v${buildInfo.version}...`);
    await this.simulate(800);

    const dockerInfo = {
      image: `myapp:${buildInfo.version}`,
      size: "245MB",
      layers: 12,
    };

    context.set("docker.info", dockerInfo);
    console.log("✅ Docker image built successfully");
  }

  private async simulate(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

/**
 * Clase reutilizable para testing
 */
export class TestOperations {
  @Step("test.unit")
  async runUnitTests(context: SharedContext): Promise<void> {
    context.require("build.completed");

    console.log("🧪 Running unit tests...");
    await this.simulate(600);

    const testResults = {
      passed: 42,
      failed: 0,
      coverage: "95%",
      duration: "2m 15s",
    };

    context.set("test.unit.results", testResults);
    console.log("✅ Unit tests passed");
  }

  @Step("test.integration")
  async runIntegrationTests(context: SharedContext): Promise<void> {
    context.require("build.completed");

    console.log("🔗 Running integration tests...");
    await this.simulate(900);

    const testResults = {
      scenarios: 15,
      passed: 15,
      failed: 0,
      duration: "5m 30s",
    };

    context.set("test.integration.results", testResults);
    console.log("✅ Integration tests passed");
  }

  @Step("test.e2e")
  async runE2ETests(context: SharedContext): Promise<void> {
    // Requiere que la aplicación esté desplegada
    context.require("deploy.staging.url");

    console.log("🌐 Running E2E tests...");
    await this.simulate(1200);

    const testResults = {
      scenarios: 8,
      passed: 7,
      failed: 1,
      duration: "8m 45s",
    };

    context.set("test.e2e.results", testResults);
    console.log("✅ E2E tests completed");
  }

  private async simulate(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

/**
 * Clase reutilizable para deployment
 */
export class DeploymentOperations {
  @Step("deploy.staging")
  async deployToStaging(context: SharedContext): Promise<void> {
    const dockerInfo = context.require("docker.info") as any;

    console.log(`🚀 Deploying ${dockerInfo.image} to staging...`);
    await this.simulate(700);

    const deployInfo = {
      environment: "staging",
      url: "https://staging.myapp.com",
      version: dockerInfo.image.split(":")[1],
      status: "running",
    };

    context.set("deploy.staging.url", deployInfo.url);
    context.set("deploy.staging.info", deployInfo);
    console.log("✅ Deployed to staging successfully");
  }

  @Step("deploy.production")
  async deployToProduction(context: SharedContext): Promise<void> {
    // Requiere que los tests E2E hayan pasado
    const e2eResults = context.require("test.e2e.results") as any;
    if (e2eResults.failed > 0) {
      throw new Error("❌ Cannot deploy to production: E2E tests failed");
    }

    const dockerInfo = context.require("docker.info") as any;
    console.log(`🌍 Deploying ${dockerInfo.image} to production...`);
    await this.simulate(1000);

    const deployInfo = {
      environment: "production",
      url: "https://myapp.com",
      version: dockerInfo.image.split(":")[1],
      status: "running",
    };

    context.set("deploy.production.url", deployInfo.url);
    context.set("deploy.production.info", deployInfo);
    console.log("✅ Deployed to production successfully");
  }

  private async simulate(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

/**
 * Clase para operaciones de seguridad
 */
export class SecurityOperations {
  @Step("security.scan")
  async scanVulnerabilities(context: SharedContext): Promise<void> {
    context.require("build.completed");

    console.log("🔒 Scanning for security vulnerabilities...");
    await this.simulate(800);

    const scanResults = {
      critical: 0,
      high: 1,
      medium: 3,
      low: 7,
      status: "passed", // passed because no critical
    };

    context.set("security.scan.results", scanResults);
    console.log("✅ Security scan completed");
  }

  private async simulate(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

/**
 * Función para demostrar la reutilización de pasos como legos
 */
export async function demonstrateLegoPattern() {
  console.log("\n🧩 === DEMOSTRACIÓN: PASOS COMO LEGOS ===\n");

  // 1. Registrar todas las clases reutilizables
  const registry = StepRegistry.getInstance();
  registry.clear(); // Limpiar para demo

    const gitOps = new GitOperations();
    const buildOps = new BuildOperations();
    const testOps = new TestOperations();
    const deployOps = new DeploymentOperations();
    const securityOps = new SecurityOperations();

    // Registrar instancias (sin prefijos, ya están en los decoradores)
    registry.registerInstance(gitOps);
    registry.registerInstance(buildOps);
    registry.registerInstance(testOps);
    registry.registerInstance(deployOps);
    registry.registerInstance(securityOps);  console.log("\n📚 Pasos disponibles:", registry.listSteps());

  // 2. Construir flujo personalizado usando pasos como legos
  console.log("\n🔧 Construyendo flujo personalizado...");

  const customFlow = new FlowBuilder()
    // Inicio secuencial
    .addStep("git.checkout")
    .addStep("build.compile")

    // Testing y seguridad en paralelo
    .addParallelSteps(["test.unit", "test.integration", "security.scan"])

    // Build de Docker (requiere tests)
    .addStep("build.docker")

    // Deploy a staging
    .addStep("deploy.staging")

    // E2E tests (requiere staging)
    .addStep("test.e2e")

    // Deploy condicional a producción
    .addConditionalStep("deploy.production", (context): boolean => {
      const e2eResults = context.get("test.e2e.results") as any;
      return e2eResults && e2eResults.failed === 0;
    })

    // Tag de release al final
    .addStep("git.tag-release");

  // 3. Validar y ejecutar
  if (customFlow.validate()) {
    console.log("\n🚀 Ejecutando flujo personalizado...");
    const startTime = Date.now();

    await customFlow.execute();

    const endTime = Date.now();
    console.log(`\n⏱️  Flujo completado en ${endTime - startTime}ms`);

    // Mostrar contexto final
    const context = customFlow.getContext();
    console.log("\n📊 Estado final del contexto:");
    console.log(JSON.stringify(context.snapshot(), null, 2));
  }
}

/**
 * Función para demostrar templates predefinidos
 */
export async function demonstrateTemplates() {
  console.log("\n📋 === DEMOSTRACIÓN: TEMPLATES PREDEFINIDOS ===\n");

  // Usando template predefinido
  const cicdFlow = FlowTemplates.cicdPipeline();

  console.log("🔧 Pasos del template CI/CD:", cicdFlow.getSteps());

  // Personalizar el template
  const customizedFlow = FlowTemplates.cicdPipeline()
    .addStep("deploy.canary") // Añadir deploy canary
    .addStep("monitoring.setup"); // Añadir monitoring

  console.log("🎨 Template personalizado:", customizedFlow.getSteps());
}

// Ejecutar demos
export async function runLegoDemo() {
  await demonstrateLegoPattern();
  await demonstrateTemplates();
}

// Ejecutar si se corre directamente
if (require.main === module) {
  runLegoDemo().catch(console.error);
}
