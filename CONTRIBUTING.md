# Contributing Guide - Step Executor Library

Thank you for your interest in contributing to Step Executor Library! This guide will help you understand how to effectively collaborate with the project.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Ways to Contribute](#ways-to-contribute)
- [Development Environment Setup](#development-environment-setup)
- [Development Process](#development-process)
- [Code Standards](#code-standards)
- [Testing](#testing)
- [Documentation](#documentation)
- [Pull Request Process](#pull-request-process)
- [Versioning and Releases](#versioning-and-releases)
- [Getting Help](#getting-help)

## 🤝 Code of Conduct

This project adheres to a code of conduct to ensure a welcoming and inclusive community:

### Our Values
- **Respect**: We treat everyone with courtesy and professionalism
- **Inclusion**: We welcome contributors from all backgrounds
- **Collaboration**: We work together towards common goals
- **Learning**: We encourage knowledge sharing

### Expected Behaviors
- ✅ Use inclusive and professional language
- ✅ Respect different viewpoints and experiences
- ✅ Accept constructive criticism positively
- ✅ Focus on what's best for the community

### Unacceptable Behaviors
- ❌ Offensive, discriminatory, or harassing language
- ❌ Personal attacks or trolling
- ❌ Publishing private information without permission
- ❌ Any conduct that would reasonably be considered inappropriate

## 🛠 Ways to Contribute

### 1. Report Bugs
- Use the [issue tracker](../../issues) to report bugs
- Include a clear description of the problem
- Provide steps to reproduce the bug
- Include environment information (Node.js version, OS, etc.)

### 2. Suggest Features
- Open a [feature request](../../issues/new) for new ideas
- Clearly describe the use case
- Explain why it would be beneficial for users
- Consider providing an initial design or prototype

### 3. Improve Documentation
- Fix typos and grammatical errors
- Improve clarity and examples
- Translate documentation to other languages
- Add tutorials and usage guides

### 4. Contribute Code
- Implement new features
- Fix existing bugs
- Improve performance
- Refactor existing code

### 5. Create Examples
- Develop practical use cases
- Create templates for different industries
- Document implementation patterns

## ⚙️ Development Environment Setup

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v8.0.0 or higher
- **Git**: For version control

### Initial Setup

1. **Fork and Clone Repository**
```bash
# Fork the repository on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/step-executor-lib.git
cd step-executor-lib

# Add the original repository as upstream
git remote add upstream https://github.com/ORIGINAL_USERNAME/step-executor-lib.git
```

2. **Install Dependencies**
```bash
# Install project dependencies
npm install

# Verify everything works
npm test
npm run build
```

3. **Editor Configuration**
```bash
# For VS Code, install recommended extensions:
# - TypeScript and JavaScript Language Features
# - Jest Test Explorer
# - ESLint
# - Prettier
```

## 🔄 Development Process

### 1. Create a Working Branch
```bash
# Make sure you're on main and up to date
git checkout main
git pull upstream main

# Create a new branch for your feature/bugfix
git checkout -b feature/my-new-feature
# or
git checkout -b bugfix/fix-specific-error
```

### 2. Develop Your Contribution
```bash
# Make changes to the code
# Write/update tests
# Document changes

# Run tests frequently
npm test

# Verify build works
npm run build
```

### 3. Commit Changes
We use [Conventional Commits](https://www.conventionalcommits.org/) for our commit messages:

```bash
# Format: type(scope): description
git commit -m "feat(core): add support for conditional steps"
git commit -m "fix(executor): correct error handling in parallel steps"
git commit -m "docs(readme): update usage examples"
git commit -m "test(pipeline): add tests for mixed strategy"
```

**Commit types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `test`: Add or modify tests
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `style`: Formatting changes (don't affect logic)
- `chore`: Maintenance tasks

## 📏 Code Standards

### TypeScript
- **Strict Mode**: Enabled
- **Decorators**: Use experimentalDecorators
- **Types**: Prefer explicit types over `any`
- **Interfaces**: Use for public contracts

### Code Style
```typescript
// ✅ Good practices
export class MyClass {
    private readonly config: ConfigType;
    
    constructor(config: ConfigType) {
        this.config = config;
    }
    
    @Step('my-step')
    async executeStep(context: SharedContext): Promise<ResultType> {
        const input = context.require<InputType>('input.data');
        
        try {
            const result = await this.processData(input);
            context.set('output.result', result);
            return result;
        } catch (error) {
            console.error('Error processing step:', error);
            throw new Error(`Failed in my-step: ${error.message}`);
        }
    }
}
```

### Naming Conventions
- **Classes**: PascalCase (`StepExecutor`, `FlowBuilder`)
- **Methods/Variables**: camelCase (`executeStep`, `stepName`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_RETRIES`, `DEFAULT_TIMEOUT`)
- **Files**: kebab-case (`step-executor.ts`, `flow-builder.ts`)
- **Decorators**: PascalCase (`@Step`, `@Parallel`)

## 🧪 Testing

### Testing Strategy
- **Minimum coverage**: 90%
- **Unit tests**: For business logic
- **Integration tests**: For complete flows
- **Performance tests**: For critical operations

### Running Tests
```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch

# Run specific tests
npm test -- --testNamePattern="StepExecutor"
```

### Writing Tests
```typescript
// example.test.ts
import { StepExecutor } from '../src/core/executor';

describe('StepExecutor', () => {
    let executor: StepExecutor;
    
    beforeEach(() => {
        executor = new StepExecutor();
    });
    
    describe('execute', () => {
        it('should execute steps sequentially', async () => {
            // Arrange
            const steps = [/* setup steps */];
            
            // Act
            const result = await executor.execute(steps);
            
            // Assert
            expect(result).toBeDefined();
            expect(result.status).toBe('completed');
        });
        
        it('should handle errors gracefully', async () => {
            // Arrange
            const failingStep = /* failing step */;
            
            // Act & Assert
            await expect(executor.execute([failingStep]))
                .rejects.toThrow('Expected error message');
        });
    });
});
```

## 📚 Documentation

### Types of Documentation

1. **Code**: JSDoc for public APIs
```typescript
/**
 * Executes a series of steps using the specified strategy
 * @param steps - Array of steps to execute
 * @param strategy - Execution strategy ('sequential' | 'parallel' | 'mixed')
 * @returns Promise that resolves when all steps are complete
 * @throws {Error} If any step fails during execution
 * @example
 * ```typescript
 * const steps = [step1, step2, step3];
 * await executor.execute(steps, 'parallel');
 * ```
 */
async execute(steps: Step[], strategy: ExecutionStrategy): Promise<void>
```

2. **README**: Keep examples up to date
3. **Guides**: For complex use cases
4. **Changelog**: Document changes in each version

### Updating Documentation
- Update README.md if you change public APIs
- Add examples for new features
- Document breaking changes clearly
- Include diagrams when helpful

## 🔀 Pull Request Process

### Before Submitting
```bash
# 1. Ensure you're up to date
git fetch upstream
git rebase upstream/main

# 2. Run all checks
npm test
npm run build
npm run lint

# 3. Verify commits
git log --oneline
```

### Create Pull Request
1. **Descriptive title**: "feat(core): add conditional step support"
2. **Detailed description**:
   - What problem it solves
   - How it solves it
   - Screenshots/examples if applicable
   - Breaking changes if any

3. **PR Template**:
```markdown
## Description
Brief description of the changes

## Type of Change
- [ ] Bug fix (non-breaking change that fixes an issue)
- [ ] New feature (non-breaking change that adds functionality)
- [ ] Breaking change (fix or feature that would change existing functionality)
- [ ] Documentation change

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] All tests pass

## Checklist
- [ ] My code follows the project conventions
- [ ] I have performed a self-review of my code
- [ ] I have commented my code where necessary
- [ ] I have updated the documentation
- [ ] My changes generate no new warnings
```

### Review Process
1. **Automated review**: CI/CD runs tests
2. **Code review**: Maintainers review the code
3. **Feedback**: Respond to comments and make changes
4. **Approval**: Merge once approved

## 📦 Versioning and Releases

### Semantic Versioning
We follow [SemVer](https://semver.org/):
- **MAJOR**: Breaking changes (v1.0.0 → v2.0.0)
- **MINOR**: New backwards-compatible features (v1.0.0 → v1.1.0)
- **PATCH**: Backwards-compatible bug fixes (v1.0.0 → v1.0.1)

### Release Process
1. **Maintainers** create releases
2. **Automatic changelog** based on commits
3. **Automatic npm publish** via CI/CD
4. **GitHub release** with detailed notes

## 🆘 Getting Help

### Communication Channels
- **Issues**: For bugs and feature requests
- **Discussions**: For general questions and ideas
- **Discord/Slack**: [Link if exists]
- **Email**: maintainer@example.com

### Frequently Asked Questions

**Q: How can I add a new execution strategy?**
A: Implement the `ExecutionStrategy` interface and add tests. See `src/strategies/` for examples.

**Q: Can I contribute without knowing TypeScript?**
A: Yes! You can help with documentation, examples, testing, and reporting bugs.

**Q: How long does it take for PR review?**
A: Typically 2-5 business days. You can ping after a week.

## 🎉 Recognition

All contributors are recognized in:
- **README.md**: Contributors list
- **CHANGELOG.md**: Credit for each release
- **GitHub**: Contributors section

Thank you for contributing to Step Executor Library! 🚀

---

*Last updated: September 2025*
