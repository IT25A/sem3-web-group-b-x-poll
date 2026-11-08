import { pool } from '#lib/server/db/index.ts';

export async function GET() {
    try {
        await pool.query('SELECT 1');
        return new Response('ok');
    } catch {
        return new Response('database unavailable', { status: 503 });
    }
}