const { Game } = require('../models/Game');


async function getRandomQuestions(req, res) {
    try {
        const { type, subject } = req.params;
        const questions = await Game.getRandomQuestions(type, subject);
        res.json(questions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getVeryRandomQuestions(req,res) {
    try {
        const questions = await Game.getVeryRandomQuestions();
        res.json(questions)
    } catch (error) {
        res.status(500).json({error: error.message});
    }
    
}

async function endGame(req, res) {
    try {
        const gameId = req.params.gameId;
        const { studentId, finalScore, questionsAnswered, correctAnswers } = req.body;
        
        const result = await Game.endGame(gameId, studentId, finalScore, questionsAnswered, correctAnswers);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function startGame(req, res) {
    try {
        const gameId  = req.params.gameId;
        const { studentId } = req.body; 
        const result = await Game.startGame(gameId , studentId);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


module.exports = {
    getRandomQuestions,
    getVeryRandomQuestions,
    endGame,
    startGame

}