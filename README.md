# Step Executor Library

Una librería TypeScript potente y flexible para ejecutar flujos de trabajo complejos con soporte para estrategias secuenciales, paralelas y mixtas.

## 🚀 Instalación

```bash
npm install step-executor-lib
# o
yarn add step-executor-lib
```

## 📋 Uso Básico

### 1. Usando Decoradores (Recomendado)

```typescript
import 'reflect-metadata';
import { Step, Parallel } from 'step-executor-lib';
import { Executor } from 'step-executor-lib';

class MiClase {
    @Step('paso-1')
    async primerPaso() {
        console.log('Ejecutando primer paso...');
        return { resultado: 'completado' };
    }

    @Step('paso-2')
    @Parallel() // Este paso se ejecutará en paralelo
    async segundoPaso() {
        console.log('Ejecutando segundo paso...');
        return { resultado: 'completado' };
    }
}

// Ejecutar
const executor = new Executor();
const miInstancia = new MiClase();
await executor.execute(miInstancia);
```

### 2. Usando Pipeline Directo

```typescript
import { Pipeline, Step } from 'step-executor-lib';

const pasos = [
    new Step('configurar', async () => {
        console.log('Configurando sistema...');
        return { config: 'listo' };
    }),
    new Step('procesar', async () => {
        console.log('Procesando datos...');
        return { datos: 'procesados' };
    })
];

const pipeline = new Pipeline(pasos);
await pipeline.execute();
```

## 🎯 Estrategias de Ejecución

### Secuencial
Los pasos se ejecutan uno después del otro.

```typescript
import { SequentialStrategy } from 'step-executor-lib';

const estrategia = new SequentialStrategy(pasos);
await estrategia.execute();
```

### Paralelo
Todos los pasos se ejecutan simultáneamente.

```typescript
import { ParallelStrategy } from 'step-executor-lib';

const estrategia = new ParallelStrategy(pasos);
await estrategia.execute();
```

### Mixto
Combina ejecución secuencial y paralela.

```typescript
import { MixedStrategy } from 'step-executor-lib';

const pasosSecuenciales = [/* pasos que deben ir en orden */];
const pasosParalelos = [/* pasos que pueden ejecutarse simultáneamente */];

const estrategia = new MixedStrategy(pasosSecuenciales, pasosParalelos);
await estrategia.execute();
```

## 💡 Ejemplos Prácticos

### CI/CD Pipeline

```typescript
class CIPipeline {
    @Step('build')
    async build() {
        console.log('🔨 Building application...');
        return { artifacts: 'dist/' };
    }

    @Step('test')
    @Parallel()
    async runTests() {
        console.log('🧪 Running tests...');
        return { coverage: '95%' };
    }

    @Step('deploy')
    async deploy() {
        console.log('🚀 Deploying to production...');
        return { url: 'https://mi-app.com' };
    }
}
```

### Microservicios

```typescript
class MicroservicesDeployment {
    @Step('setup-infrastructure')
    async setupInfra() {
        console.log('🏗️ Setting up infrastructure...');
        return { vpc: 'vpc-123', db: 'ready' };
    }

    @Step('deploy-auth-service')
    @Parallel()
    async deployAuth() {
        console.log('🔐 Deploying auth service...');
        return { service: 'auth', port: 3001 };
    }

    @Step('deploy-api-service')
    @Parallel()
    async deployAPI() {
        console.log('🌐 Deploying API service...');
        return { service: 'api', port: 3000 };
    }
}
```

## 🔧 Configuración Avanzada

### TypeScript

Asegúrate de tener estas configuraciones en tu `tsconfig.json`:

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

### Dependencias

```typescript
// Importar reflect-metadata al inicio de tu aplicación
import 'reflect-metadata';
```

## 📊 Beneficios

- ✅ **Paralelización automática**: Mejora el rendimiento ejecutando tareas independientes simultáneamente
- ✅ **Gestión de dependencias**: Controla el orden de ejecución de manera inteligente  
- ✅ **Manejo de errores**: Captura y gestiona errores de manera robusta
- ✅ **TypeScript nativo**: Soporte completo con tipos seguros
- ✅ **Decoradores elegantes**: Sintaxis limpia y declarativa
- ✅ **Flexible**: Múltiples estrategias de ejecución según tus necesidades

## 🎯 Casos de Uso

- **Pipelines CI/CD**: Build, test, deploy
- **Procesamiento de datos**: ETL, transformaciones
- **Microservicios**: Deployment y orquestación
- **Automatización**: Scripts complejos con dependencias
- **APIs**: Procesamiento de solicitudes multi-paso

¡Listo para comenzar! 🚀

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Nos encantaría que formes parte de la comunidad.

### Formas de Contribuir
- 🐛 [Reportar bugs](../../issues/new?template=bug_report.md)
- 🚀 [Sugerir nuevas funcionalidades](../../issues/new?template=feature_request.md)
- 📚 Mejorar documentación
- 🧪 Añadir ejemplos y casos de uso
- 💻 Contribuir código

### Guías de Contribución
- 📖 [Guía de Contribución (Español)](./CONTRIBUTING_ES.md)
- 📖 [Contributing Guide (English)](./CONTRIBUTING.md)

### Desarrollo Local
```bash
# Clonar el repositorio
git clone https://github.com/TU_USUARIO/step-executor-lib.git
cd step-executor-lib

# Instalar dependencias
npm install

# Ejecutar pruebas
npm test

# Ejecutar ejemplos
npm run examples all
```

## Prerequisites

This project requires Node.js version 18 or higher. We recommend using [nvm](https://github.com/nvm-sh/nvm) to manage Node.js versions.

### Using nvm

If you have nvm installed, you can use the included `.nvmrc` file to automatically switch to the correct Node.js version:

```bash
nvm use
```

If you don't have the required version installed, nvm will prompt you to install it:

```bash
nvm install
```

## Features

- **Sequential Execution**: Execute steps one after another using the Sequential Strategy.
- **Parallel Execution**: Execute multiple steps simultaneously with the Parallel Strategy.
- **Mixed Execution**: Combine both sequential and parallel execution strategies for flexible workflows.
- **Dependency Resolution**: Automatically resolve dependencies between steps to determine the correct execution order.
- **Error Handling**: Built-in error handling to capture and log errors during execution.
- **Logging**: Comprehensive logging capabilities to track execution progress and issues.

## Installation

To install the Step Executor Library, use npm:

```bash
npm install step-executor-lib
```

## Usage

### Basic Example

```typescript
import { Executor } from 'step-executor-lib/src/core/executor';
import { Step } from 'step-executor-lib/src/core/step';

const executor = new Executor();

const step1 = new Step('Step 1', async () => {
    // Logic for Step 1
});

const step2 = new Step('Step 2', async () => {
    // Logic for Step 2
});

executor.registerStep(step1);
executor.registerStep(step2);

executor.execute(); // Executes steps sequentially by default
```

### Parallel Execution

To execute steps in parallel, use the Parallel Strategy:

```typescript
import { ParallelStrategy } from 'step-executor-lib/src/strategies/parallel.strategy';

executor.setStrategy(new ParallelStrategy());
executor.execute(); // Executes registered steps in parallel
```

## 🧪 Testing

La librería incluye pruebas unitarias e integración para asegurar funcionalidad:

```bash
# Ejecutar todas las pruebas
npm test

# Ejecutar con cobertura
npm run test:coverage

# Ejecutar ejemplos
npm run examples all
```

## 📄 License

Este proyecto está licenciado bajo la Licencia MIT. Ver el archivo [LICENSE](./LICENSE) para detalles.

## 🙏 Agradecimientos

Gracias a todos los [contribuidores](../../contributors) que han hecho posible este proyecto.

---

**¿Tienes preguntas?** Abre un [issue](../../issues) o consulta nuestras [discusiones](../../discussions).