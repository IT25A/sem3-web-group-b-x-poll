import { publish } from './hub';
import { QUESTIONS, type Question } from './questions';

type PollState = {
    questionIndex: number;
    showResults: boolean;
    votes: Map<string, Map<string, string>>; // questionId -> voterId -> optionId
};

const g = globalThis as unknown as { __xpollState?: PollState };
const state = g.__xpollState ?? { questionIndex: 0, showResults: false, votes: new Map() } as PollState;

export type VoteResult = 'ok' | 'stale-question' | 'invalid-option' | 'already-voted';

export function getCurrentQuestion(): Question {
    return QUESTIONS[state.questionIndex];
}

export function getProgress()  {
    return { index: state.questionIndex, total: QUESTIONS.length };
}

export function getShowResults(): boolean {
    return state.showResults;
}

export function getVoteOf(voterId: string, questionId: string): string | null {
    return state.votes.get(questionId)?.get(voterId) ?? null;
}

export function getTotalVotes(questionId: string): number {
    return state.votes.get(questionId)?.size ?? 0;
}

export function getCounts(question: Question) {
    const counts = new Map<string, number>();
    for (const optionId of state.votes.get(question.id)?.values() ?? []) {
        counts.set(optionId, (counts.get(optionId) ?? 0) + 1);
    }
    return question.options.map((option) => ({ ...option, count: counts.get(option.id) ?? 0}));
}

export function castVote(voterId: string, questionId: string, optionId: string): VoteResult {
    const question = getCurrentQuestion();

    if (question.id !== questionId) return 'stale-question';
    if (!question.options.some((option) => option.id === optionId)) return 'invalid-option';

    let votes = state.votes.get(questionId);
    if (!votes) {
        votes = new Map();
        state.votes.set(questionId, votes);
    }
    if (votes.has(voterId)) return 'already-voted'; // only first vote counts

    votes.set(voterId, optionId);
    publish('votes');
    return 'ok';
}

export function goToQuestion(index: number): void {
    const clamped = Math.min(Math.max(index, 0), QUESTIONS.length - 1);
    if (clamped === state.questionIndex) return;
    state.questionIndex = clamped;
    state.showResults = false; // every new question starts with results hidden
    publish('question');
}

export function setShowResults(show: boolean): void {
    state.showResults = show;
    publish('results');
}

export function resetPoll(): void {
  state.votes.clear();
  state.questionIndex = 0;
  state.showResults = false;
  publish('question');
}