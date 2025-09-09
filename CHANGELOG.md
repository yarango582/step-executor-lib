# Changelog

Todos los cambios notables en este proyecto serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Manuales de contribución en español e inglés
- Plantillas de GitHub para issues y pull requests
- Documentación mejorada con ejemplos prácticos

## [1.0.0] - 2025-09-08

### Added
- ✨ Implementación inicial de Step Executor Library
- 🔧 Soporte para estrategias de ejecución secuencial, paralela y mixta
- 🎨 Sistema de decoradores para definición de pasos (`@Step`, `@Parallel`)
- 🧩 StepRegistry para reutilización de pasos como "legos"
- 🔄 SharedContext para compartir datos entre pasos de diferentes clases
- 🏗️ FlowBuilder para construcción declarativa de flujos
- 📚 Ejemplos prácticos: CI/CD Pipeline, Microservicios, Patrón Lego
- 🧪 Cobertura de pruebas del 100%
- 📖 Documentación completa con casos de uso reales

### Core Features
- **Executor**: Motor principal para ejecución de pasos
- **Pipeline**: Gestión de flujos de pasos
- **Step**: Clase base para definición de pasos
- **DependencyResolver**: Resolución automática de dependencias
- **Estrategias**: Sequential, Parallel, Mixed

### Decorators
- `@Step(name)`: Marca métodos como pasos ejecutables
- `@Parallel()`: Marca pasos para ejecución paralela

### Utilities
- **Logger**: Sistema de logging integrado
- **ErrorHandler**: Manejo robusto de errores
- **StepRegistry**: Registro global de pasos reutilizables
- **SharedContext**: Contexto compartido entre pasos

### Examples
- `sequential-pipeline.ts`: Pipeline CI/CD secuencial
- `mixed-pipeline.ts`: Deployment de microservicios mixto
- `lego-pattern.ts`: Demostración de reutilización de pasos
- Scripts de ejecución de ejemplos

### Documentation
- README completo con guía de uso
- Ejemplos prácticos para diferentes casos de uso
- Configuración TypeScript detallada
- Guías de instalación y configuración

### Testing
- 47 pruebas unitarias e integración
- Cobertura del 100% en statements
- Tests para todas las estrategias de ejecución
- Tests de integración para flujos completos

---

## [0.1.0] - 2025-09-07

### Added
- 🚀 Versión inicial del proyecto
- ⚙️ Configuración básica de TypeScript y Jest
- 📦 Estructura inicial del proyecto

---

### Tipos de Cambios
- `Added` para nuevas funcionalidades
- `Changed` para cambios en funcionalidades existentes
- `Deprecated` para funcionalidades que serán removidas
- `Removed` para funcionalidades removidas
- `Fixed` para corrección de bugs
- `Security` para vulnerabilidades de seguridad

### Semantic Versioning
- **MAJOR** (X.0.0): Breaking changes
- **MINOR** (0.X.0): Nuevas funcionalidades compatibles
- **PATCH** (0.0.X): Bug fixes compatibles
