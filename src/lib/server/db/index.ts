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

/** A pool or a single checked-out client (e.g. inside a transaction). */
export type Db = pg.Pool | pg.PoolClient;

export async function query<T extends pg.QueryResultRow>(
	sql: string,
	params: unknown[] = [],
	db: Db = pool
): Promise<T[]> {
	const result = await db.query<T>(sql, params);
	return result.rows;
}

export async function queryOne<T extends pg.QueryResultRow>(
	sql: string,
	params: unknown[] = [],
	db: Db = pool
): Promise<T | null> {
	const rows = await query<T>(sql, params, db);
	return rows[0] ?? null;
}

/**
 * Runs `fn` inside a transaction. Pass the given client to query/queryOne.
 * Commits if `fn` resolves, rolls back and rethrows if it throws.
 */
export async function transaction<T>(fn: (client: pg.PoolClient) => Promise<T>): Promise<T> {
	const client = await pool.connect();
	try {
		await client.query('BEGIN');
		const result = await fn(client);
		await client.query('COMMIT');
		return result;
	} catch (error) {
		await client.query('ROLLBACK');
		throw error;
	} finally {
		client.release();
	}
}
