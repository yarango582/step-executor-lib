export class ParallelStrategy {
    async execute(steps: Array<() => Promise<any>>): Promise<any[]> {
        const results = await Promise.all(steps.map(step => step()));
        return results;
    }
}