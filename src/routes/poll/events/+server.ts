import { subscribe } from '#lib/server/poll/hub.ts';

export function GET() {
    const encoder = new TextEncoder();
    let cleanup = () => {};

    const stream = new ReadableStream({
        start(controller) {
            function send(text: string) {
                try {
                    controller.enqueue(encoder.encode(text));
                } catch {
                    cleanup(); // stream already closed
                }
            }
            const unsubscribe = subscribe((event) => send(`event: ${event}\ndata: 1\n\n`));
            const heartbeat = setInterval(() => send(': ping\n\n'), 20_000);
            cleanup = () => {
                clearInterval(heartbeat);
                unsubscribe();
            }

            // flush headers and set reconnect delay
            send(`retry: 3000\n\n`);
        },
        cancel() {
            cleanup();
        }
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache, no-transform',
            'X-Accel-Buffering': 'no' // disable buffering for nginx
        }
    });
}