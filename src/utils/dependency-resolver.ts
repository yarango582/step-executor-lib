import { Step } from '../core/step';

// Simple dependency graph implementation
class SimpleDependencyGraph {
    private nodes: Set<string> = new Set();
    private dependencies: Map<string, Set<string>> = new Map();

    addNode(node: string): void {
        this.nodes.add(node);
        if (!this.dependencies.has(node)) {
            this.dependencies.set(node, new Set());
        }
    }

    addDependency(node: string, dependency: string): void {
        this.addNode(node);
        this.addNode(dependency);
        this.dependencies.get(node)?.add(dependency);
    }

    overallOrder(): string[] {
        const visited = new Set<string>();
        const visiting = new Set<string>();
        const result: string[] = [];

        const visit = (node: string): void => {
            if (visiting.has(node)) {
                throw new Error(`Circular dependency detected involving ${node}`);
            }
            if (visited.has(node)) {
                return;
            }

            visiting.add(node);
            const deps = this.dependencies.get(node) || new Set();
            for (const dep of deps) {
                visit(dep);
            }
            visiting.delete(node);
            visited.add(node);
            result.push(node);
        };

        for (const node of this.nodes) {
            if (!visited.has(node)) {
                visit(node);
            }
        }

        return result;
    }
}

export class DependencyResolver {
    private graph: SimpleDependencyGraph;

    constructor() {
        this.graph = new SimpleDependencyGraph();
    }

    public addStep(step: Step, dependencies: string[]): void {
        this.graph.addNode(step.name);
        dependencies.forEach(dep => {
            this.graph.addNode(dep);
            this.graph.addDependency(step.name, dep);
        });
    }

    public resolveOrder(): string[] {
        return this.graph.overallOrder();
    }
}