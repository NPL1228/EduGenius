import { Flashcard } from '@/types/combine';

export const MOCK_CARDS: Flashcard[] = [
    {
        id: '1',
        question: 'What is the type of "null" in JavaScript?',
        answer: 'object',
        difficulty: 'easy',
        hints: ['It is a primitive value, but typeof says otherwise due to a legacy bug.', 'it starts with o'],
    },
    {
        id: '2',
        question: 'What keyword is used to declare a block-scoped variable?',
        answer: 'let',
        difficulty: 'easy',
        hints: ['Not var', 'Allows reassignment'],
    },
    {
        id: '3',
        question: 'What is the result of 2 + "2" in JavaScript?',
        answer: '22',
        difficulty: 'medium',
        hints: ['Type coercion happens here.', 'String concatenation.'],
    },
    {
        id: '4',
        question: 'Which method creates a new array with all elements that pass a test?',
        answer: 'filter',
        difficulty: 'medium',
        hints: ['It filters the array.', 'Array.prototype....'],
    },
    {
        id: '5',
        question: 'BOSS: Explain the event loop briefly (keyword only).',
        answer: 'callstack',
        difficulty: 'boss',
        hints: ['It monitors the Call Stack and Callback Queue.', 'The mechanism that handles async operations.'],
    }
];
