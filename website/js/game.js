const userAnswers = [];

function selectAnswer(button) {
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
  userAnswers.push(selectedAnswer);

  console.log("User selected:", selectedAnswer);
}

