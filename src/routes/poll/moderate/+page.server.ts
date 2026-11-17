import { 
    getCurrentQuestion,
    getProgress,
    getShowResults,
    getTotalVotes,
    goToQuestion,
    resetPoll,
    setShowResults
} from '#lib/server/poll/store.ts';

export function load({ depends }) {
    depends('app:poll');
    const question = getCurrentQuestion();
    return {
        question,
        ...getProgress(),
        showResults: getShowResults(),
        totalVotes: getTotalVotes(question.id)
    };
}

export const actions = {
    next: () => {
        goToQuestion(getProgress().index + 1);
    },
    previous: () => {
        goToQuestion(getProgress().index - 1);
    },
    toggleResults: () => {
        setShowResults(!getShowResults());
    },
    reset: () => {
        resetPoll();
    }
};