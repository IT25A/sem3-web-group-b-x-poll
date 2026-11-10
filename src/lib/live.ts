import { onMount } from 'svelte';
import { invalidate } from '$app/navigation';

export function useLiveUpdates(eventNames: string[]) {
    onMount(() => {
        const source = new EventSource('/poll/events');
        let timer: ReturnType<typeof setTimeout> | undefined;

        function refresh() {
            if (timer) return; // reload already scheduled
            timer = setTimeout(() => {
                timer = undefined;
                invalidate('app:poll');
            }, 250);
        }

        source.addEventListener('open', refresh); // refresh on every reconnect
        for (const name of eventNames) {
            source.addEventListener(name, refresh);
        }

        return () => {
            source.close();
            clearTimeout(timer);
        };
    });
}