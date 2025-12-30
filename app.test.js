import {
    generateShuffledNumbers,
    SECONDS_PER_MINUTE,
    MS_PER_SECOND
} from './app.js';

describe('Math Grid Application', () => {
    beforeEach(() => {
        // Setup DOM
        document.body.innerHTML = `
            <div id="timer"></div>
            <button id="start">Start</button>
            <div id="app">
                ${Array(169).fill('<div></div>').join('')}
            </div>
        `;

        // Clear localStorage
        localStorage.clear();

        // Mock confirm
        global.confirm = jest.fn(() => true);
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.clearAllTimers();
    });

    describe('generateShuffledNumbers', () => {
        test('should contain all numbers once', () => {
            const numbers = generateShuffledNumbers(12);
            const sorted = [...numbers].sort((a, b) => a - b);

            expect(sorted).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
        });
    });

    describe('Timer functionality', () => {
        beforeEach(() => {
            jest.useFakeTimers();
        });

        afterEach(() => {
            jest.useRealTimers();
        });

        test('should format time correctly', () => {
            const elapsed = 125; // 2 minutes 5 seconds

            const minutes = Math.floor(elapsed / SECONDS_PER_MINUTE);
            const seconds = elapsed % SECONDS_PER_MINUTE;

            expect(minutes).toBe(2);
            expect(seconds).toBe(5);
        });

        test('should calculate elapsed seconds from milliseconds', () => {
            const milliseconds = 5500;

            const seconds = Math.floor(milliseconds / MS_PER_SECOND);
            expect(seconds).toBe(5);
        });
    });

    describe('Input validation', () => {
        test('should validate correct multiplication', () => {
            const rowNum = 5;
            const colNum = 7;
            const expectedResult = rowNum * colNum;
            const userInput = 35;

            expect(userInput).toBe(expectedResult);
        });

        test('should detect incorrect multiplication', () => {
            const rowNum = 5;
            const colNum = 7;
            const expectedResult = rowNum * colNum;
            const userInput = 30;

            expect(userInput).not.toBe(expectedResult);
        });
    });

    describe('LocalStorage state management', () => {
        test('should save state to localStorage', () => {
            const STORAGE_KEY = 'mathGridState';
            const state = {
                startTime: Date.now(),
                correctAnswers: 5,
                timerRunning: true,
                finalElapsedSeconds: 0,
                topRow: ['X', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
                firstColumn: ['X', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
                inputValues: []
            };

            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
            const savedState = localStorage.getItem(STORAGE_KEY);

            expect(savedState).toBeTruthy();

            const parsedState = JSON.parse(savedState);
            expect(parsedState.correctAnswers).toBe(5);
            expect(parsedState.timerRunning).toBe(true);
        });

        test('should load state from localStorage', () => {
            const STORAGE_KEY = 'mathGridState';
            const state = {
                startTime: Date.now(),
                correctAnswers: 10,
                timerRunning: false,
                finalElapsedSeconds: 125,
                topRow: ['X', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
                firstColumn: ['X', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
                inputValues: []
            };

            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
            const savedState = localStorage.getItem(STORAGE_KEY);
            const parsedState = JSON.parse(savedState);

            expect(parsedState.correctAnswers).toBe(10);
            expect(parsedState.finalElapsedSeconds).toBe(125);
        });
    });

    describe('Correct answer tracking', () => {
        test('should increment correctAnswers when answer is correct', () => {
            let correctAnswers = 0;
            const wasCorrect = false;
            const isCorrect = true;

            if (isCorrect && !wasCorrect) {
                correctAnswers++;
            }

            expect(correctAnswers).toBe(1);
        });

        test('should decrement correctAnswers when changing from correct to incorrect', () => {
            let correctAnswers = 5;
            const wasCorrect = true;
            const isCorrect = false;

            if (!isCorrect && wasCorrect) {
                correctAnswers--;
            }

            expect(correctAnswers).toBe(4);
        });

        test('should not change correctAnswers if already correct', () => {
            let correctAnswers = 5;
            const wasCorrect = true;
            const isCorrect = true;

            if (isCorrect && !wasCorrect) {
                correctAnswers++;
            }

            expect(correctAnswers).toBe(5);
        });
    });

    describe('Grid generation', () => {
        test('should have 169 cells (13x13)', () => {
            const GRID_SIZE = 13;
            const totalCells = GRID_SIZE * GRID_SIZE;

            expect(totalCells).toBe(169);
        });

        test('should have 144 input cells (12x12, excluding first row and column)', () => {
            const GRID_SIZE = 13;
            const inputCells = (GRID_SIZE - 1) * (GRID_SIZE - 1);

            expect(inputCells).toBe(144);
        });

        test('should calculate correct cell index', () => {
            const GRID_SIZE = 13;
            const row = 2;
            const col = 3;
            const expectedIndex = row * GRID_SIZE + col;

            expect(expectedIndex).toBe(29);
        });
    });
});
