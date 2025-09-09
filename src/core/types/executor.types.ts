export interface ExecutorOptions {
    parallel?: boolean;
    timeout?: number;
}

export interface StepDefinition {
    name: string;
    execute: () => Promise<any>;
}