export class Executor {
    private steps: Map<string, Function> = new Map();
    private strategy: 'sequential' | 'parallel' | 'mixed';

    constructor(strategy: 'sequential' | 'parallel' | 'mixed' = 'sequential') {
        this.strategy = strategy;
    }

    registerStep(name: string, step: Function): void {
        this.steps.set(name, step);
    }

    async execute(stepNames: string[]): Promise<void> {
        const stepsToExecute = stepNames
            .map(name => this.steps.get(name))
            .filter((step): step is Function => step !== undefined);

        if (this.strategy === 'sequential') {
            for (const step of stepsToExecute) {
                await step();
            }
        } else if (this.strategy === 'parallel') {
            await Promise.all(stepsToExecute.map(step => step()));
        } else if (this.strategy === 'mixed') {
            // Implement mixed strategy logic here
        }
    }
}