const db = require('../db/connect');

class Game {
    constructor(data) {
        this.game_id = data.game_id;
        this.game_name = data.game_name;
        this.game_type = data.game_type;
        this.subject_id = data.subject_id;
    }

    // static async getVeryRandomQuestions() {
    //     try {
    //         const questions = await db.query(`SELECT * FROM Quiz_Questions ORDER BY RANDOM() LIMIT 10`);
    //         return questions.rows.map(row => ({
    //             id: row.question_id,
    //             question: row.question,
    //             answer: row.answer,
    //             options: row.options,
    //             difficulty: row.difficulty,
    //             topic: row.topic
    //         }));
    //     } catch (error) {
    //         console.error("Error fetching questions:", error);
    //         throw error; 
    //     }
        
    // }

    static async getRandomQuestions(questionType, subjectName) {
        try {
            console.log('Original params:', { questionType, subjectName });
    
            const subjectNameClean = subjectName.trim().toLowerCase();
            
            const questionTypeNormalised = questionType
                .trim()
                .toLowerCase()
                .replace(/\s+/g, ''); // Remove all whitespace
                
            console.log('Normalised question type:', questionTypeNormalised);
    
            const subjectResult = await db.query(
                `SELECT subject_id FROM subjects WHERE LOWER(subject) = $1`,
                [subjectNameClean]
            );
    
            if (!subjectResult.rows.length) {
                throw new Error(`Subject "${subjectName}" not found`);
            }
    
            const subjectId = subjectResult.rows[0].subject_id;
    
            const result = await db.query(
                `SELECT question_id, question, answer, options, difficulty, question_type, topic FROM Quiz_Questions WHERE LOWER(REPLACE(question_type, ' ', '')) = $1 AND subject_id = $2 ORDER BY RANDOM() LIMIT 10`,
                [questionTypeNormalised, subjectId]
            );
    
    
            if (!result.rows.length) {
                const typeCheck = await db.query(
                    `SELECT DISTINCT question_type, LOWER(REPLACE(question_type, ' ', '')) as normalised
                     FROM Quiz_Questions WHERE subject_id = $1`,
                    [subjectId]
                );
                
                console.log('Available question types in DB:', typeCheck.rows);
                
                const availableTypes = typeCheck.rows.map(row => row.question_type);
                throw new Error(
                    `No questions found for type "${questionType}". ` +
                    `Available types: ${availableTypes.join(', ')}`
                );
            }
    
            return result.rows.map(row => ({
                id: row.question_id,
                question: row.question,
                answer: row.answer,
                options: row.options,
                difficulty: row.difficulty,
                topic: row.topic
            }));
    
        } catch (error) {
            console.error("Error fetching questions:", error);
            throw error; 
        }
    }

    static async endGame(gameId, userID, finalScore, questionsAnswered, correctAnswers) {
        try {
            console.log('Ending game:', { gameId, userID, finalScore, questionsAnswered, correctAnswers });
    
            // check if student and game exist
            const studentCheck = await db.query(
                `SELECT student_id FROM Students WHERE user_id = $1`,
                [userID]
            );
          
            if (!studentCheck.rows.length) {
                throw new Error(`Student with ID ${userID} not found`);
            }

            const studentId = studentCheck.rows[0].student_id;
    
            const gameCheck = await db.query(
                `SELECT game_id FROM Games WHERE game_id = $1`,
                [gameId]
            );
            
            if (!gameCheck.rows.length) {
                throw new Error(`Game with ID ${gameId} not found`);
            }
               
            const existingStats = await db.query(
                `SELECT * FROM Student_Stats WHERE student_id = $1 AND game_id = $2`,
                [studentId, gameId]
            );
    
            let updatedStats;
    
            if (existingStats.rows.length > 0) {
               
                const currentStats = existingStats.rows[0];
                const newTimesPlayed = currentStats.times_played + 1;
                const newAvgScore = Math.round(
                    ((currentStats.avg_score * currentStats.times_played) + finalScore) / newTimesPlayed
                );
                const newBestScore = Math.max(currentStats.best_score, finalScore);
    
                updatedStats = await db.query(
                    `UPDATE Student_Stats 
                     SET times_played = $1, 
                         avg_score = $2, 
                         best_score = $3, 
                         last_score = $4
                     WHERE student_id = $5 AND game_id = $6 RETURNING *`,
                    [newTimesPlayed, newAvgScore, newBestScore, finalScore, studentId, gameId]
                );
            } else {
            
                updatedStats = await db.query(
                    `INSERT INTO Student_Stats (student_id, game_id, times_played, avg_score, best_score, last_score) VALUES ($1, $2, 1, $3, $3, $3) RETURNING *`,
                    [studentId, gameId, finalScore]
                );
            }
            
            const stats = updatedStats.rows[0];
            console.log(stats);
            return {
                gameId: parseInt(gameId),
                studentId: parseInt(studentId),
                finalScore,
                questionsAnswered,
                correctAnswers,
                accuracy: questionsAnswered > 0 ? Math.round((correctAnswers / questionsAnswered) * 100) : 0,
                stats: {
                    timesPlayed: stats.times_played,
                    averageScore: stats.avg_score,
                    bestScore: stats.best_score,
                    lastScore: stats.last_score
                }
            };
    
        } catch (error) {
            console.error("Error ending game:", error);
            throw error;
        }
    }






}



module.exports = { Game };