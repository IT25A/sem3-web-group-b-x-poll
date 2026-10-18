import fs from 'node:fs';
import path from 'node:path';
import { Client } from 'pg';

const client = new Client({
	user: process.env.POSTGRES_USER,
	password: process.env.POSTGRES_PASSWORD,
	database: process.env.POSTGRES_DB,
	host: process.env.POSTGRES_HOST,
	port: Number(process.env.POSTGRES_PORT)
});

await client.connect();
await client.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
        name text PRIMARY KEY,
        applied_at timestamptz NOT NULL DEFAULT now()
)`);

const dir = path.resolve('./migrations');
const files = fs
	.readdirSync(dir)
	.filter((file) => file.endsWith('.sql'))
	.sort();
const { rows } = await client.query('SELECT name FROM schema_migrations');

const appliedMigrations = new Set(rows.map((row) => row.name));

let newlyAppliedCount = 0;

for (const file of files) {
	if (appliedMigrations.has(file)) continue;

	const sql = fs.readFileSync(path.join(dir, file), 'utf-8');
	try {
		await client.query('BEGIN');
		await client.query(sql);
		await client.query('INSERT INTO schema_migrations (name) VALUES ($1)', [file]);
		await client.query('COMMIT');
		console.log(`Applied migration: ${file}`);
		newlyAppliedCount++;
	} catch (error) {
		await client.query('ROLLBACK');
		throw error;
	}
}
if (newlyAppliedCount === 0) {
	console.log('No new migrations to apply.');
}
await client.end();
