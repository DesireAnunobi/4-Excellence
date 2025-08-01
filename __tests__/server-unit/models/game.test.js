const {Game} = require('../../../server/models/Game.js');

jest.mock('../../../server/db/connect.js', () => ({
  query: jest.fn(),
  end: jest.fn()
}));

const db = require("../../../server/db/connect.js");

describe('Game', () => {
    beforeEach(() => jest.clearAllMocks());
    afterAll(() => jest.resetAllMocks());

    describe('getRandomQuestions', () => {
        it('returns questions for valid subject and question type', async () => {
            db.query.mockResolvedValueOnce({ rows: [{ subject_id: 1 }] });

            db.query.mockResolvedValueOnce({
                rows: [
                {
                    question_id: 1,
                    question: "What is the capital of France?",
                    answer: "Paris",
                    options: ["Paris", "Rome", "Madrid", "Berlin"],
                    difficulty: "easy",
                    question_type: "multiple-choice",
                    topic: "Geography"
                }
                ]
            });

            const result = await Game.getRandomQuestions("multiple-choice", "Geography");

            expect(db.query).toHaveBeenCalledTimes(2);
            expect(db.query).toHaveBeenCalledTimes(2);
            expect(result).toEqual([
                {
                    id: 1,
                    question: "What is the capital of France?",
                    answer: "Paris",
                    options: ["Paris", "Rome", "Madrid", "Berlin"],
                    difficulty: "easy",
                    topic: "Geography"
                }
            ]);
        });

        it('throws error if subject is not found', async () => {
            db.query.mockResolvedValueOnce({ rows: [] });

            await expect(
                Game.getRandomQuestions("multiple-choice", "erroneous subject")
            ).rejects.toThrow('Subject "erroneous subject" not found');

            expect(db.query).toHaveBeenCalledTimes(1);
        });

        it('throws error if no questions for given type are found', async () => {
            db.query.mockResolvedValueOnce({ rows: [{ subject_id: 1 }] });

            db.query.mockResolvedValueOnce({ rows: [] });

            db.query.mockResolvedValueOnce({
                rows: [
                    { question_type: 'Multiple Choice', normalised: 'multiplechoice' },
                    { question_type: 'True/False', normalised: 'truefalse' }
                ]
            });

            await expect(
                Game.getRandomQuestions("multiple-choice", "Geography")
            ).rejects.toThrow(`No questions found for type "multiple-choice". ` +`Available types: Multiple Choice, True/False`);

            expect(db.query).toHaveBeenCalledTimes(3);
        });
    });

    describe('endGame', () => {
        it('updates stats if entry exists', async () => {
            db.query.mockResolvedValueOnce({ rows: [{ student_id: 10 }] });
            db.query.mockResolvedValueOnce({ rows: [{ game_id: 1 }] });
            db.query.mockResolvedValueOnce({ rows: [{ times_played: 2, avg_score: 70, best_score: 90 }] });
            db.query.mockResolvedValueOnce({
                rows: [{
                    times_played: 3,
                    avg_score: 75,
                    best_score: 95,
                    last_score: 95
                }]
            });

            const result = await Game.endGame(1, 10, 95, 10, 9);

            expect(db.query).toHaveBeenCalledTimes(4);

            expect(result).toEqual({
                gameId: 1,
                studentId: 10,
                finalScore: 95,
                questionsAnswered: 10,
                correctAnswers: 9,
                accuracy: 90,
                stats: {
                    timesPlayed: 3,
                    averageScore: 75,
                    bestScore: 95,
                    lastScore: 95
                }
            });
        });

        it('creates a new stat entry if entry does not exist', async () => {
            db.query.mockResolvedValueOnce({ rows: [{ student_id: 10 }] });
            db.query.mockResolvedValueOnce({ rows: [{ game_id: 1 }] });
            db.query.mockResolvedValueOnce({ rows: [] });
            db.query.mockResolvedValueOnce({
                rows: [{
                    times_played: 1,
                    avg_score: 95,
                    best_score: 95,
                    last_score: 95
                }]
            });

            const result = await Game.endGame(1, 10, 95, 10, 9);

            expect(db.query).toHaveBeenCalledTimes(4);

            expect(result).toEqual({
                gameId: 1,
                studentId: 10,
                finalScore: 95,
                questionsAnswered: 10,
                correctAnswers: 9,
                accuracy: 90,
                stats: {
                    timesPlayed: 1,
                    averageScore: 95,
                    bestScore: 95,
                    lastScore: 95
                }
            });
        });

        it('throws error if student is not found', async () => {
            db.query.mockResolvedValueOnce({rows: []});

            await expect(Game.endGame(1, 1, 50, 5, 3)).rejects.toThrow(`Student with ID 1 not found`);

            expect(db.query).toHaveBeenCalledTimes(1);
        });

        it('throws error if game is not found', async () => {
            db.query.mockResolvedValueOnce({ rows: [{ student_id: 10 }] });
            db.query.mockResolvedValueOnce({ rows: [] });

            await expect(Game.endGame(1, 10, 50, 5, 3)).rejects.toThrow(`Game with ID 1 not found`);

            expect(db.query).toHaveBeenCalledTimes(2);
        });
    });
});