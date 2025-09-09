# Guía de Contribución - Step Executor Library

¡Gracias por tu interés en contribuir a Step Executor Library! Esta guía te ayudará a entender cómo puedes colaborar efectivamente con el proyecto.

## 📋 Tabla de Contenidos

- [Código de Conducta](#código-de-conducta)
- [Formas de Contribuir](#formas-de-contribuir)
- [Configuración del Entorno de Desarrollo](#configuración-del-entorno-de-desarrollo)
- [Proceso de Desarrollo](#proceso-de-desarrollo)
- [Estándares de Código](#estándares-de-código)
- [Pruebas](#pruebas)
- [Documentación](#documentación)
- [Proceso de Pull Request](#proceso-de-pull-request)
- [Versionado y Releases](#versionado-y-releases)
- [Obtener Ayuda](#obtener-ayuda)

## 🤝 Código de Conducta

Este proyecto adhiere a un código de conducta para asegurar una comunidad acogedora y inclusiva:

### Nuestros Valores
- **Respeto**: Tratamos a todos con cortesía y profesionalismo
- **Inclusión**: Damos la bienvenida a contribuidores de todos los trasfondos
- **Colaboración**: Trabajamos juntos hacia objetivos comunes
- **Aprendizaje**: Fomentamos el intercambio de conocimientos

### Comportamientos Esperados
- ✅ Usar lenguaje inclusivo y profesional
- ✅ Respetar diferentes puntos de vista y experiencias
- ✅ Aceptar críticas constructivas de manera positiva
- ✅ Enfocarse en lo que es mejor para la comunidad

### Comportamientos Inaceptables
- ❌ Lenguaje ofensivo, discriminatorio o acosador
- ❌ Ataques personales o trolling
- ❌ Publicación de información privada sin permiso
- ❌ Cualquier conducta que razonablemente se consideraría inapropiada

## 🛠 Formas de Contribuir

### 1. Reportar Bugs
- Usa el [issue tracker](../../issues) para reportar bugs
- Incluye una descripción clara del problema
- Proporciona pasos para reproducir el bug
- Incluye información del entorno (Node.js version, OS, etc.)

### 2. Sugerir Funcionalidades
- Abre un [feature request](../../issues/new) para nuevas ideas
- Describe claramente el caso de uso
- Explica por qué sería beneficioso para los usuarios
- Considera proporcionar un diseño inicial o prototipo

### 3. Mejorar Documentación
- Correcciones de typos y errores gramaticales
- Mejorar claridad y ejemplos
- Traducir documentación a otros idiomas
- Añadir tutoriales y guías de uso

### 4. Contribuir Código
- Implementar nuevas funcionalidades
- Corregir bugs existentes
- Mejorar rendimiento
- Refactorizar código existente

### 5. Crear Ejemplos
- Desarrollar casos de uso prácticos
- Crear templates para diferentes industrias
- Documentar patrones de implementación

## ⚙️ Configuración del Entorno de Desarrollo

### Prerrequisitos
- **Node.js**: v18.0.0 o superior
- **npm**: v8.0.0 o superior
- **Git**: Para control de versiones

### Configuración Inicial

1. **Fork y Clone del Repositorio**
```bash
# Fork el repositorio en GitHub, luego clona tu fork
git clone https://github.com/TU_USUARIO/step-executor-lib.git
cd step-executor-lib

# Añade el repositorio original como upstream
git remote add upstream https://github.com/ORIGINAL_USUARIO/step-executor-lib.git
```

2. **Instalación de Dependencias**
```bash
# Instalar dependencias del proyecto
npm install

# Verificar que todo funciona
npm test
npm run build
```

3. **Configuración del Editor**
```bash
# Para VS Code, instalar extensiones recomendadas:
# - TypeScript and JavaScript Language Features
# - Jest Test Explorer
# - ESLint
# - Prettier
```

## 🔄 Proceso de Desarrollo

### 1. Crear una Rama de Trabajo
```bash
# Asegúrate de estar en main y actualizado
git checkout main
git pull upstream main

# Crea una nueva rama para tu feature/bugfix
git checkout -b feature/mi-nueva-funcionalidad
# o
git checkout -b bugfix/corregir-error-especifico
```

### 2. Desarrollar tu Contribución
```bash
# Hacer cambios en el código
# Escribir/actualizar pruebas
# Documentar cambios

# Ejecutar pruebas frecuentemente
npm test

# Verificar que el build funciona
npm run build
```

### 3. Commit de Cambios
Usamos [Conventional Commits](https://www.conventionalcommits.org/) para nuestros mensajes:

```bash
# Formato: tipo(alcance): descripción
git commit -m "feat(core): agregar soporte para pasos condicionales"
git commit -m "fix(executor): corregir manejo de errores en pasos paralelos"
git commit -m "docs(readme): actualizar ejemplos de uso"
git commit -m "test(pipeline): añadir pruebas para estrategia mixta"
```

**Tipos de commit:**
- `feat`: Nueva funcionalidad
- `fix`: Corrección de bug
- `docs`: Cambios en documentación
- `test`: Añadir o modificar pruebas
- `refactor`: Refactorización de código
- `perf`: Mejoras de rendimiento
- `style`: Cambios de formato (no afectan lógica)
- `chore`: Tareas de mantenimiento

## 📏 Estándares de Código

### TypeScript
- **Strict Mode**: Habilitado
- **Decorators**: Usar experimentalDecorators
- **Types**: Preferir tipos explícitos sobre `any`
- **Interfaces**: Usar para contratos públicos

### Estilo de Código
```typescript
// ✅ Buenas prácticas
export class MiClase {
    private readonly config: ConfigType;
    
    constructor(config: ConfigType) {
        this.config = config;
    }
    
    @Step('mi-paso')
    async ejecutarPaso(context: SharedContext): Promise<ResultType> {
        const input = context.require<InputType>('input.data');
        
        try {
            const result = await this.procesarData(input);
            context.set('output.result', result);
            return result;
        } catch (error) {
            console.error('Error procesando paso:', error);
            throw new Error(`Fallo en mi-paso: ${error.message}`);
        }
    }
}
```

### Convenciones de Nombres
- **Clases**: PascalCase (`StepExecutor`, `FlowBuilder`)
- **Métodos/Variables**: camelCase (`executeStep`, `stepName`)
- **Constantes**: UPPER_SNAKE_CASE (`MAX_RETRIES`, `DEFAULT_TIMEOUT`)
- **Archivos**: kebab-case (`step-executor.ts`, `flow-builder.ts`)
- **Decoradores**: PascalCase (`@Step`, `@Parallel`)

## 🧪 Pruebas

### Estrategia de Testing
- **Cobertura mínima**: 90%
- **Pruebas unitarias**: Para lógica de negocio
- **Pruebas de integración**: Para flujos completos
- **Pruebas de rendimiento**: Para operaciones críticas

### Ejecutar Pruebas
```bash
# Ejecutar todas las pruebas
npm test

# Ejecutar con coverage
npm run test:coverage

# Ejecutar en modo watch
npm run test:watch

# Ejecutar pruebas específicas
npm test -- --testNamePattern="StepExecutor"
```

### Escribir Pruebas
```typescript
// ejemplo.test.ts
import { StepExecutor } from '../src/core/executor';

describe('StepExecutor', () => {
    let executor: StepExecutor;
    
    beforeEach(() => {
        executor = new StepExecutor();
    });
    
    describe('execute', () => {
        it('should execute steps sequentially', async () => {
            // Arrange
            const steps = [/* configurar pasos */];
            
            // Act
            const result = await executor.execute(steps);
            
            // Assert
            expect(result).toBeDefined();
            expect(result.status).toBe('completed');
        });
        
        it('should handle errors gracefully', async () => {
            // Arrange
            const failingStep = /* paso que falla */;
            
            // Act & Assert
            await expect(executor.execute([failingStep]))
                .rejects.toThrow('Expected error message');
        });
    });
});
```

## 📚 Documentación

### Tipos de Documentación

1. **Código**: JSDoc para APIs públicas
```typescript
/**
 * Ejecuta una serie de pasos usando la estrategia especificada
 * @param steps - Array de pasos a ejecutar
 * @param strategy - Estrategia de ejecución ('sequential' | 'parallel' | 'mixed')
 * @returns Promise que resuelve cuando todos los pasos están completos
 * @throws {Error} Si algún paso falla durante la ejecución
 * @example
 * ```typescript
 * const steps = [step1, step2, step3];
 * await executor.execute(steps, 'parallel');
 * ```
 */
async execute(steps: Step[], strategy: ExecutionStrategy): Promise<void>
```

2. **README**: Mantener ejemplos actualizados
3. **Guías**: Para casos de uso complejos
4. **Changelog**: Documentar cambios en cada versión

### Actualizar Documentación
- Actualizar README.md si cambias APIs públicas
- Añadir ejemplos para nuevas funcionalidades
- Documentar breaking changes claramente
- Incluir diagramas cuando sea útil

## 🔀 Proceso de Pull Request

### Antes de Enviar
```bash
# 1. Asegurar que estás actualizado
git fetch upstream
git rebase upstream/main

# 2. Ejecutar todas las verificaciones
npm test
npm run build
npm run lint

# 3. Verificar commits
git log --oneline
```

### Crear Pull Request
1. **Título descriptivo**: "feat(core): add conditional step support"
2. **Descripción detallada**:
   - Qué problema resuelve
   - Cómo lo resuelve
   - Screenshots/ejemplos si aplica
   - Breaking changes si los hay

3. **Template de PR**:
```markdown
## Descripción
Breve descripción de los cambios

## Tipo de Cambio
- [ ] Bug fix (non-breaking change que corrige un issue)
- [ ] Nueva funcionalidad (non-breaking change que añade funcionalidad)
- [ ] Breaking change (fix o feature que cambiaría funcionalidad existente)
- [ ] Cambio de documentación

## Testing
- [ ] Pruebas unitarias añadidas/actualizadas
- [ ] Pruebas de integración añadidas/actualizadas
- [ ] Todas las pruebas pasan

## Checklist
- [ ] Mi código sigue las convenciones del proyecto
- [ ] He realizado una auto-revisión de mi código
- [ ] He comentado mi código donde es necesario
- [ ] He actualizado la documentación
- [ ] Mis cambios no generan nuevos warnings
```

### Proceso de Revisión
1. **Revisión automática**: CI/CD ejecuta pruebas
2. **Revisión de código**: Maintainers revisan el código
3. **Feedback**: Responder a comentarios y hacer cambios
4. **Aprobación**: Merge una vez aprobado

## 📦 Versionado y Releases

### Semantic Versioning
Seguimos [SemVer](https://semver.org/):
- **MAJOR**: Breaking changes (v1.0.0 → v2.0.0)
- **MINOR**: Nuevas funcionalidades compatibles (v1.0.0 → v1.1.0)
- **PATCH**: Bug fixes compatibles (v1.0.0 → v1.0.1)

### Proceso de Release
1. **Maintainers** crean releases
2. **Changelog** automático basado en commits
3. **npm publish** automático via CI/CD
4. **GitHub release** con notas detalladas

## 🆘 Obtener Ayuda

### Canales de Comunicación
- **Issues**: Para bugs y feature requests
- **Discussions**: Para preguntas generales y ideas
- **Discord/Slack**: [Enlace si existe]
- **Email**: maintainer@example.com

### Preguntas Frecuentes

**P: ¿Cómo puedo añadir una nueva estrategia de ejecución?**
R: Implementa la interfaz `ExecutionStrategy` y añade pruebas. Ver `src/strategies/` para ejemplos.

**P: ¿Puedo contribuir sin saber TypeScript?**
R: ¡Sí! Puedes ayudar con documentación, ejemplos, testing, y reportar bugs.

**P: ¿Cuánto tiempo toma que revisen mi PR?**
R: Típicamente 2-5 días laborales. Puedes hacer ping después de una semana.

## 🎉 Reconocimientos

Todos los contribuidores son reconocidos en:
- **README.md**: Lista de contribuidores
- **CHANGELOG.md**: Crédito por cada release
- **GitHub**: Contributors section

¡Gracias por contribuir a Step Executor Library! 🚀

---

*Última actualización: Septiembre 2025*
