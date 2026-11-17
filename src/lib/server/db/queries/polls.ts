import {query, queryOne, transaction} from '../index';
import type {Answer, Poll, PollWithQuestions, Question, QuestionWithAnswers} from '../types';

// JSON array of a question's answers, used as a subquery (expects the question aliased as q)
const ANSWERS_JSON = `
    COALESCE(
        (SELECT json_agg(
                    json_build_object(
                        'id', a.id,
                        'question_id', a.question_id,
                        'answer_text', a.answer_text
                    ) ORDER BY a.id
                )
         FROM answers a
         WHERE a.question_id = q.id),
        '[]'
    )`;

export function getAllPolls() {
    return query<Poll> (
        `SELECT id, title, description
         FROM polls`
    );
}

export function getAllPollsWithQuestions() {
    return query<PollWithQuestions> (
        `SELECT p.id, p.title, p.description,
                COALESCE(
                    json_agg(
                        json_build_object(
                            'id', q.id,
                            'poll_id', q.poll_id,
                            'type', q.type,
                            'question_text', q.question_text,
                            'answers', ${ANSWERS_JSON}
                        ) ORDER BY q.id
                    ) FILTER (WHERE q.id IS NOT NULL),
                    '[]'
                ) AS questions
         FROM polls p
         LEFT JOIN questions q ON q.poll_id = p.id
         GROUP BY p.id
         ORDER BY p.id`
    );
}

export type NewQuestion = Pick<Question, 'type' | 'question_text'> & {
    answers: string[];
};

export function createPollWithQuestions(
    title: string,
    description: string | null,
    questions: NewQuestion[]
): Promise<PollWithQuestions> {
    return transaction(async (client) => {
        const poll = (await queryOne<Poll>(
            `INSERT INTO polls (title, description)
             VALUES ($1, $2)
             RETURNING id, title, description`,
            [title, description],
            client
        ))!;

        const createdQuestions: QuestionWithAnswers[] = [];
        for (const q of questions) {
            const question = (await queryOne<Question>(
                `INSERT INTO questions (poll_id, type, question_text)
                 VALUES ($1, $2, $3)
                 RETURNING id, poll_id, type, question_text`,
                [poll.id, q.type, q.question_text],
                client
            ))!;

            // insert all answers of this question in one statement, keeping their order
            const answers = await query<Answer>(
                `INSERT INTO answers (question_id, answer_text)
                 SELECT $1, answer_text
                 FROM unnest($2::text[]) WITH ORDINALITY AS t(answer_text, pos)
                 ORDER BY pos
                 RETURNING id, question_id, answer_text`,
                [question.id, q.answers ?? []],
                client
            );

            createdQuestions.push({ ...question, answers });
        }

        return { ...poll, questions: createdQuestions };
    });
}

export function getPollById(id: number) {
    return queryOne<Poll> (
        `SELECT id, title, description
         FROM polls
         WHERE id = $1`,
        [id]
    );
}

export function getQuestionsByPollId(pollId: number) {
    return query<QuestionWithAnswers> (
        `SELECT q.id, q.poll_id, q.type, q.question_text,
                ${ANSWERS_JSON} AS answers
         FROM questions q
         WHERE q.poll_id = $1
         ORDER BY q.id`,
        [pollId]
    );
}
