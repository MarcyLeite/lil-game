export const createEmitter = <T extends Record<string, unknown[]>>() => {
    const listeners: { [K in keyof T]?: Array<(...args: T[K]) => void> } = {};

    const on = <K extends keyof T>(event: K, fn: (...args: T[K]) => void) => {
        (listeners[event] ??= []).push(fn);
    };

    const emit = <K extends keyof T>(event: K, ...args: T[K]) => {
        listeners[event]?.forEach(fn => fn(...args));
    };

    return { on, emit };
};
