import { fail } from '@sveltejs/kit';
import { castVote, getCurrentQuestion, getVoteOf } from '#lib/server/poll/store.ts';
import { getVoterId } from '#lib/server/poll/voter.ts';

export function load({ cookies, url, depends }) {
    depends('app:poll');
    const voterId = getVoterId(cookies, url);
    const question = getCurrentQuestion();
    return { question, myVote: getVoteOf(voterId, question.id) };
}

export const actions = {
    default: async ({ request, cookies, url }) => {
        const voterId = getVoterId(cookies, url);
        const form = await request.formData();
        const result = castVote(
            voterId,
            String(form.get('questionId')),
            String(form.get('optionId'))
        );
        if (result === 'stale-question' || result === 'invalid-option') {
            return fail(409, { message: 'This question is no longer active.' });
        }
        // 'ok' and 'already-voted' both result in a reload with the current state
    }
};