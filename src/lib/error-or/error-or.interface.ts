export interface ErrorOr<T> {
    error?: Error;
    value?: T;
}

export function left<T>(error: Error): ErrorOr<T> {
    return { error };
}

export function right<T>(value?: T): ErrorOr<T> {
    return { value };
}

export function isLeft(x: ErrorOr<unknown>): boolean  {
    return x.error !== undefined && x.error !== null;
}

export function isRigth(x: ErrorOr<unknown>): boolean {
    return !!x.value;
}