export type ErrorSeverity = 'error' | 'warning' | 'info';

export class BusinessError extends Error {
    public severity: ErrorSeverity;
    public retryAction?: () => void;
    public title?: string;

    constructor(message: string, options?: { severity?: ErrorSeverity; retryAction?: () => void; title?: string }) {
        super(message);
        this.name = 'BusinessError';
        this.severity = options?.severity || 'error';
        this.retryAction = options?.retryAction;
        this.title = options?.title;

        // Ensure proper prototype chain
        Object.setPrototypeOf(this, BusinessError.prototype);
    }
}

export const isBusinessError = (error: any): error is BusinessError => {
    return error instanceof BusinessError;
};
