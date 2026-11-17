export type Option = { id: string; label: string };
export type Question = { id: string; text: string; options: Option[] };

export const QUESTIONS: Question[] = [
    {
        id: 'q1',
        text: 'Which editor do you use most?',
        options: [
            { id: 'vscode', label: 'VS Code' },
            { id: 'jetbrains', label: 'JetBrains IDE' },
            { id: 'vim', label: 'Vim / Neovim' },
            { id: 'other', label: 'Something else' }
        ]
    },
    {
        id: 'q2',
        text: 'Tabs or spaces?',
        options: [
            { id: 'tabs', label: 'Tabs' },
            { id: 'spaces', label: 'Spaces' }
        ]
    },
    {
        id: 'q3',
        text: 'Is the live update working?',
        options: [
            { id: 'yes', label: 'Yes' },
            { id: 'no', label: 'No' },
            { id: 'maybe', label: 'Maybe' }
        ]
    }
];