import { redirect, type RequestEvent } from '@sveltejs/kit';

export function requireLogin(event: RequestEvent) {
	if (!event.locals.user) {
		const target = event.url.pathname + event.url.search;
		redirect(303, `/login?redirect_to=${encodeURIComponent(target)}`);
	}
	return event.locals.user;
}
