import {fail} from '@sveltejs/kit';
import {createPollWithQuestions, getAllPolls, type NewQuestion } from '#lib/server/db/queries/polls.ts';
import type { Question } from '#lib/server/db/types.ts';
import type {Actions, PageServerLoad} from './$types';

type QuestionType = Question['type'];
const QUESTION_TYPES: QuestionType[] = ['single', 'multiple', 'text', 'rating'];

export const load: PageServerLoad = async () => {
    const polls = await getAllPolls();
    return {polls};
};

export const actions = {
    createPoll: async ({ request }) => {
        const formData = await request.formData();
        const title = String(formData.get('title'));
        const description = String(formData.get('description'));
        const questionCount = Number(formData.get('questionCount'));

        const questions: NewQuestion[] = [];
        for (let i = 0; i < questionCount; i++) {
            const optionCount = Number(formData.get(`questions/${i}/optionCount`));
            const options: string[] = [];

            for (let j = 0; j < optionCount; j++) {
                options.push(String(formData.get(`questions/${i}/options/${j}`)));
            }

            const questionType = String(formData.get(`questions/${i}/type`));
            if (!QUESTION_TYPES.includes(questionType as QuestionType)) {
                return fail(400, { message: `Invalid question type: ${questionType}` });
            }

            questions.push({
                type: questionType as QuestionType,
                question_text: String(formData.get(`questions/${i}/text`)),
                answers: options
            });
        }

        await createPollWithQuestions(title, description, questions);
    }
} satisfies Actions;