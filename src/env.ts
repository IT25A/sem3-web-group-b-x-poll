import { defineEnvVars } from '@sveltejs/kit/env';
import * as v from 'valibot';

const identifier = (name: string) =>
	v.pipe(
		v.string(),
		v.regex(
			/^[A-Za-z0-9_-]+$/,
			`${name} must only contain letters, numbers, underscores, and hyphens`
		)
	);

const hostname = (name: string) =>
	v.pipe(
		v.string(),
		v.regex(/^[A-Za-z0-9.-]+$/, `${name} must only contain letters, numbers, dots, and hyphens`)
	);

const port = (name: string) =>
	v.pipe(
		v.string(),
		v.regex(/^[0-9]+$/, `${name} must only contain numbers`),
		v.check((value) => Number(value) <= 65535, `${name} must be 65535 or lower`)
	);

const secret = (name: string, minLength: number) =>
	v.pipe(
		v.string(),
		v.minLength(minLength, `${name} must be at least ${minLength} characters long`)
	);

export const variables = defineEnvVars({
	POSTGRES_USER: { schema: identifier('POSTGRES_USER') },
	POSTGRES_PASSWORD: { schema: secret('POSTGRES_PASSWORD', 16) },
	POSTGRES_DB: { schema: identifier('POSTGRES_DB') },
	POSTGRES_HOST: { schema: hostname('POSTGRES_HOST') },
	POSTGRES_PORT: { schema: port('POSTGRES_PORT') }
});
