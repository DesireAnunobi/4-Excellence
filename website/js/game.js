let userAnswers = [];
let questionList = [];
const gameOptions = {"geography": 1, "history": 2};

document.getElementById('homebtn').addEventListener('click', async () => {
  const data = {
    studentId: localStorage.getItem("userID"),
    finalScore: 0,
    questionsAnswered: 0,
    correctAnswers: 0
  }

  await endGame(data);

  window.location.assign("students.html");
});

document.getElementById('logoutbtn').addEventListener('click', async () => {
  const data = {
    studentId: localStorage.getItem("userID"),
    finalScore: 0,
    questionsAnswered: 0,
    correctAnswers: 0
  }

  await endGame(data);

  localStorage.removeItem('userID');
  localStorage.removeItem('username');
  localStorage.removeItem('token');
  window.location.assign('login.html');
});

async function getQuestions() {
  questionList = [];

  const API_URL = 'http://localhost:3000';

  const params = new URLSearchParams(window.location.search);
  const game = params.get('game');

  let url = API_URL + `/game/qs/multiple-choice/${game}`;

  const response = await getAll(url);
  const result = await response.json();

  questionList = result;

  setUpQuestion();
};

async function endGame(data) {
  const API_URL = 'http://localhost:3000';

  const params = new URLSearchParams(window.location.search);
  const game = params.get('game');

  let url = API_URL + `/game/${gameOptions[game]}/ended`

  const response = await sendPostRequest(url, data);
}

function setUpQuestion() {
  resetButtons();

  const currentQuestion = questionList[userAnswers.length];
  const question = currentQuestion.question;
  const options = currentQuestion.options;

  document.getElementById('gameQuestion').textContent = question;
  
  let i = 0;

  for (i in options) {
    let temp = parseInt(i) + 1;
    document.getElementById(`box${temp}`).textContent = options[i];
  }

  i++;

  if (i != 4) {
    for (i; i < 4; i++) {
      let temp = parseInt(i) + 1;
      document.getElementById(`box${temp}`).textContent = 'null';
      document.getElementById(`box${temp}`).disabled = true;
      document.getElementById(`box${temp}`).hidden = true;
    }
  }
};

function resetButtons() {
  for (let i = 1; i <= 4; i++) {
    document.getElementById(`box${i}`).textContent = '1';
    document.getElementById(`box${i}`).classList = 'answer-box';
    document.getElementById(`box${i}`).disabled = false;
    document.getElementById(`box${i}`).hidden = false;
  }
};

async function selectAnswer(button) {
  const buttons = document.querySelectorAll(".answer-box");

  if ([...buttons].some(btn => btn.classList.contains("selected"))) return;

  buttons.forEach(btn => {
    if (btn === button) {
      btn.classList.add("selected");
    } else {
      btn.disabled = true;
      btn.classList.add("disabled");
    }
  });

  const selectedAnswer = button.textContent.trim();

  const currentQuestion = questionList[userAnswers.length];
  const options = currentQuestion.options;
  const answer = currentQuestion.answer;

  if (selectedAnswer === answer) {
    button.classList.add("correct");
    userAnswers.push(true);
  } else {
    button.classList.add("wrong");

    buttons.forEach(btn => {
      if (btn.textContent.trim() === answer) {
        btn.classList.add("correct");
      }

    });

    userAnswers.push(false);
  }

  await sleep(1000);  // wait for 1 second

  if (userAnswers.length < 10) {
    setUpQuestion();
  } else {
    // send it off
    const data = {
      studentId: localStorage.getItem("userID"),
      finalScore: userAnswers.filter(value => value === true).length,
      questionsAnswered: userAnswers.length,
      correctAnswers: userAnswers.filter(value => value === true).length
    }

    await endGame(data);

    sessionStorage.setItem("answers", JSON.stringify(userAnswers));

    window.location.assign('game-result.html');
  }
}

async function sendPostRequest(url, data) {
    const options = {
        method: "POST",
        headers: {
          "Authorization": localStorage.getItem("token"),
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    }

    const resp = await fetch(url, options);

    return resp;
};

async function getAll(url) {
    const options = {
        method: "GET",
        headers: {
            "Authorization": localStorage.getItem("token"),
            "Content-Type": "application/json"
        }
    }

    const resp = await fetch(url, options);

    return resp;
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

getQuestions();