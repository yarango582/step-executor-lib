import { StepDefinition } from './executor.types';

export interface PipelineOptions {
    name: string;
    steps: StepDefinition[];
    parallelExecution?: boolean; // Option to allow parallel execution of steps
}

export interface PipelineResult {
    success: boolean;
    results: PipelineStepResult[];
    errors?: string[];
}

export interface PipelineStepResult {
    name: string;
    status: 'success' | 'failure';
    data?: any;
    error?: string;
}