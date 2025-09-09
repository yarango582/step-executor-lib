import { Step } from './step';

export class Pipeline {
    private steps: Step[] = [];

    addStep(step: Step): void {
        this.steps.push(step);
    }

    async run(strategy: 'sequential' | 'parallel'): Promise<void> {
        if (strategy === 'sequential') {
            for (const step of this.steps) {
                await step.execute();
            }
        } else if (strategy === 'parallel') {
            await Promise.all(this.steps.map(step => step.execute()));
        }
    }
}