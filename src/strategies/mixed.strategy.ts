import { Step } from '../core/step';

export class MixedStrategy {
    private sequentialSteps: Step[] = [];
    private parallelSteps: Step[] = [];

    constructor(sequential: Step[], parallel: Step[]) {
        this.sequentialSteps = sequential;
        this.parallelSteps = parallel;
    }

    public async execute(): Promise<void> {
        // Execute sequential steps
        for (const step of this.sequentialSteps) {
            await step.execute();
        }

        // Execute parallel steps
        await Promise.all(this.parallelSteps.map(step => step.execute()));
    }
}