export class Step {
    name: string;
    execute: () => Promise<any>;

    constructor(name: string, execute: () => Promise<any>) {
        this.name = name;
        this.execute = execute;
    }

    async run(): Promise<any> {
        try {
            console.log(`Executing step: ${this.name}`);
            const result = await this.execute();
            console.log(`Step ${this.name} completed successfully.`);
            return result;
        } catch (error) {
            console.error(`Error executing step ${this.name}:`, error);
            throw error;
        }
    }
}