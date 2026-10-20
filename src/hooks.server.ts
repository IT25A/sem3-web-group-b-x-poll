import { sequence, type Handle } from '@sveltejs/kit/hooks';
import { building } from '$app/env';
import { svelteKitHandler } from 'better-auth/svelte-kit';
import { auth } from '#lib/server/auth/index.ts';
import { requireLogin } from '#lib/server/auth/guard.ts';

const sessionHandle: Handle = async ({ event, resolve }) => {
	const session = await auth.api.getSession({ headers: event.request.headers });
	event.locals.user = session?.user ?? null;
	return resolve(event);
};

const protectHandle: Handle = ({ event, resolve }) => {
	if (event.route.id?.startsWith('/(protected)')) requireLogin(event);
	return resolve(event);
};

const authHandle: Handle = ({ event, resolve }) =>
	svelteKitHandler({ event, resolve, auth, building });

export const handle = sequence(sessionHandle, protectHandle, authHandle);
