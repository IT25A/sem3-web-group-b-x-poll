CREATE TABLE polls (
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    title text NOT NULL,
    description text
);

CREATE TABLE questions (
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    poll_id integer REFERENCES polls(id) ON DELETE CASCADE,
    type text NOT NULL,
    question_text text NOT NULL,

    Constraint question_type_check CHECK (type IN ('text', 'multiple', 'single', 'rating'))
);

CREATE TABLE answers (
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    question_id integer REFERENCES questions(id) ON DELETE CASCADE,
    answer_text text NOT NULL
);