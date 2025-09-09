export class SequentialStrategy {
    private steps: Array<() => Promise<void>> = [];

    public addStep(step: () => Promise<void>): void {
        this.steps.push(step);
    }

    public async execute(): Promise<void> {
        for (const step of this.steps) {
            await step();
        }
    }
}