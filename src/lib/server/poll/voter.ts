import type { Cookies } from '@sveltejs/kit';

const COOKIE_NAME = 'xpoll_voter';

export function getVoterId(cookies: Cookies, url: URL): string {
    let id = cookies.get(COOKIE_NAME);
    if (!id) {
        id = crypto.randomUUID();
        cookies.set(COOKIE_NAME, id, {
            path: '/',
            httpOnly: true,
            sameSite: 'lax',
            secure: url.protocol === 'https:',
            maxAge: 60 * 60 * 24 // 1 day
        });
    }
    return id;
}