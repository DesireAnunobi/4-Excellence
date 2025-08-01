const {getRandomQuestions, endGame} = require('../../../server/controllers/game.js');
const {Game} = require('../../../server/models/Game.js');

const mockSend = jest.fn()
const mockJson = jest.fn()
const mockEnd = jest.fn()

const mockStatus = jest.fn(() => ({ 
  send: mockSend, 
  json: mockJson, 
  end: mockEnd 
}));

let mockRes = { status: mockStatus };

describe('Game Controller', () => {
  beforeEach(() => jest.clearAllMocks())

  afterAll(() => jest.resetAllMocks())

  describe('getRandomQuestions', () => {
    let mockReq;

    beforeEach(() => {
      mockReq = { params: { type: 'multiple-choice', subject: 'Geography' } }
    });

    it('returns a set of random questions with no status code', async () => {
      mockRes = { json: mockJson };

      jest.spyOn(Game, 'getRandomQuestions').mockResolvedValue(
        {
          id: 1,
          question: "What is the capital of France?",
          answer: "Paris",
          options: ["Paris", "Rome", "Madrid", "Berlin"],
          difficulty: "easy",
          topic: "Geography"
        }
      );

      await getRandomQuestions(mockReq, mockRes);

      expect(Game.getRandomQuestions).toHaveBeenCalledTimes(1);
      expect(mockJson).toHaveBeenCalledWith(
        {
          id: 1,
          question: "What is the capital of France?",
          answer: "Paris",
          options: ["Paris", "Rome", "Madrid", "Berlin"],
          difficulty: "easy",
          topic: "Geography"
        }
      );
    });

    it('throws an error if something goes wrong with status code 500', async () => {
      mockRes = { status: mockStatus };

      jest.spyOn(Game, 'getRandomQuestions').mockRejectedValue(new Error('oh no'))

      await getRandomQuestions(mockReq, mockRes);

      expect(Game.getRandomQuestions).toHaveBeenCalledTimes(1);
      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({ error: 'oh no' });
    });
  });

  describe('endGame', () => {
    let mockReq;

    beforeEach(() => {
      mockReq = { 
        params: { gameID: 1 },
        body: {studentID: 5, finalScore: 8, questionsAnswered: 10, correctAnswers: 8}
      }
    });

    it('ends the game and saves results to student stats with no status code', async () => {
      mockRes = { json: mockJson };

      jest.spyOn(Game, 'endGame').mockResolvedValue(
        {
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
        }
      );

      await endGame(mockReq, mockRes);

      expect(Game.endGame).toHaveBeenCalledTimes(1);
      expect(mockJson).toHaveBeenCalledWith(
        {
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
        }
      );
    });

    it('throws an error if something goes wrong with status code 500', async () => {
      mockRes = { status: mockStatus };

      jest.spyOn(Game, 'endGame').mockRejectedValue(new Error('oh no'));

      await endGame(mockReq, mockRes);

      expect(Game.endGame).toHaveBeenCalledTimes(1);
      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({ error: 'oh no' });
    });
  });
});