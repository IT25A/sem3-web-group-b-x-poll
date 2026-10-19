CREATE TABLE members (
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name text NOT NULL,
    email text NOT NULL UNIQUE,
    created_at timestamptz NOT NULL DEFAULT now()
);