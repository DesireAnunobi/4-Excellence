// routers/gameRouter.js
const express = require('express');
const gameRouter = express.Router();
const gameController = require("../controllers/game");
const authenticator = require('../middleware/authenticator');

// Game Routers
gameRouter.post('/:gameID/ended', gameController.endGame); 
// gameRouter.get('/qs', gameController.getVeryRandomQuestions); // Get 10 Random Questions - random subject and random type of quesiton
gameRouter.get('/qs/:type/:subject', authenticator, gameController.getRandomQuestions); // Get 10 Random questions from a specific subject and specific type
// gameRouter.post('/:gameID', gameController.startGame);   // reponse should include game details, and in the case of quizzes a selection of 10 random questions

module.exports = gameRouter;