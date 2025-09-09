export function handleError(error: Error): void {
    console.error("An error occurred:", error.message);
    // Additional error handling logic can be added here
}

export function logErrorToService(error: Error): void {
    // Logic to log error to an external service can be implemented here
}