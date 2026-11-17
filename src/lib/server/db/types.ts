export interface Member {
	id: number;
	name: string;
	email: string;
	created_at: Date;
}

export interface Poll {
	id: number;
	title: string;
	description: string | null;
}

export interface Question {
	id: number;
	poll_id: number;
	type: 'single' | 'multiple' | 'text' | 'rating';
	question_text: string;
}

export interface Answer {
	id: number;
	question_id: number;
	answer_text: string;
}

export interface QuestionWithAnswers extends Question {
	answers: Answer[];
}

export interface PollWithQuestions extends Poll {
	questions: QuestionWithAnswers[];
}
