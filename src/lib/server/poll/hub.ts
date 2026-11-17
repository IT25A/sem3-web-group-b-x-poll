export type PollEvent = 'question' | 'votes' | 'results'
type Listener = (event: PollEvent) => void;

const g = globalThis as unknown as { __xpollListeners?: Set<Listener> };

const listeners = g.__xpollListeners ?? new Set();

export function subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

export function publish(event: PollEvent): void {
    for (const listener of listeners) {
        try {
            listener(event);
        } catch {} // one broken connection must not stop the others
    }
}