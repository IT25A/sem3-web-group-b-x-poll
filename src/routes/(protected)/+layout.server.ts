import { requireLogin } from '#lib/server/auth/guard.ts';

export function load(event) {
	const { email, emailVerified, name, username, sub } = requireLogin(event);
	return { user: { email, emailVerified, name, username, sub } };
}
