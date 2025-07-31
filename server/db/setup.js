const fs = require('fs');
const path = require('path');
require("dotenv").config(); 

const db = require("./connect.js");
const questions = require("./dump-questions.js")

async function setUpAll(baseDir = __dirname) {
    const sql = fs.readFileSync(__dirname + '/setup.sql').toString();

    const quizzes = ['ks3_history_questions.json', 'ks3_geography_questions.json'];

    await db.query(sql)
        .then(data => console.log("Set-up complete."))
        .catch(error => console.log(error));

    for (let i in quizzes) {
        let filepath = path.join(baseDir, 'questions', quizzes[i]);

        await db.query(questions(filepath))
            .then(data => {
                console.log('Dumping questions.');
            })
            .catch(error => console.log(error));
    };

    db.end();
};

if (require.main === module) {
    setUpAll();
}

module.exports = setUpAll;