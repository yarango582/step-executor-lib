export interface StepOptions {
    name: string;
    description?: string;
    timeout?: number;
    parallel?: boolean;
}

export interface StepResult {
    success: boolean;
    data?: any;
    error?: Error;
}