import QRCode from 'qrcode';
import {
    getCounts,
    getCurrentQuestion,
    getShowResults,
    getTotalVotes
} from '#lib/server/poll/store.ts';

export async function load({ url, depends }) {
    depends('app:poll');
    const question = getCurrentQuestion();
    const joinUrl = new URL('/poll/vote', url.origin).toString();

    return {
        question,
        totalVotes: getTotalVotes(question.id),
        results: getShowResults() ? getCounts(question) : null,
        joinUrl,
        qrSvg: await QRCode.toString(joinUrl, { type: 'svg', margin: 1 })
    };
}