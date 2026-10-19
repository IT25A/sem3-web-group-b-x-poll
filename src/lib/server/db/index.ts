import pg from 'pg';
import {
	POSTGRES_USER,
	POSTGRES_PASSWORD,
	POSTGRES_DB,
	POSTGRES_HOST,
	POSTGRES_PORT
} from '$app/env/private';

const globalDb = globalThis as unknown as { pool?: pg.Pool };

export const pool =
	globalDb.pool ??
	new pg.Pool({
		user: POSTGRES_USER,
		password: POSTGRES_PASSWORD,
		database: POSTGRES_DB,
		host: POSTGRES_HOST,
		port: Number(POSTGRES_PORT)
	});

export async function query<T extends pg.QueryResultRow>(
	sql: string,
	params: unknown[] = []
): Promise<T[]> {
	const result = await pool.query<T>(sql, params);
	return result.rows;
}

export async function queryOne<T extends pg.QueryResultRow>(
	sql: string,
	params: unknown[] = []
): Promise<T | null> {
	const rows = await query<T>(sql, params);
	return rows[0] ?? null;
}
