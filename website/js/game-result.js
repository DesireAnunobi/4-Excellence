//results table after quiz

const answers = sessionStorage.getItem("answers");
const results = JSON.parse(answers);
sessionStorage.removeItem("answers");

document.getElementById('homebtn').addEventListener('click', async () => {
  window.location.assign("students.html");
});

document.getElementById('logoutbtn').addEventListener('click', () => {
  localStorage.removeItem('userID');
  localStorage.removeItem('username');
  localStorage.removeItem('token');
  window.location.assign('login.html');
});

window.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.getElementById("resultsTable");

  let totalCorrect = 0;

  results.forEach((correct, index) => {
    const row = document.createElement("tr");

    const questionCell = document.createElement("td");
    questionCell.textContent = `Question ${index + 1}`;

    const scoreCell = document.createElement("td");
    scoreCell.textContent = correct ? "1/1" : "0/1";
    scoreCell.classList.add(correct ? "text-success" : "text-danger", "fw-bold");
                                            //*green:red

    if (correct) {
      totalCorrect++;
    }

    row.appendChild(questionCell);
    row.appendChild(scoreCell);
    tableBody.appendChild(row);
  });

  const totalRow = document.createElement("tr");
  totalRow.classList.add("table-warning");

  const totalLabelCell = document.createElement("td");
  totalLabelCell.textContent = "Total Score";
  totalLabelCell.classList.add("fw-bold");

  const totalScoreCell = document.createElement("td");
  totalScoreCell.textContent = `${totalCorrect}/${results.length}`;
  totalScoreCell.classList.add("fw-bold", "text-primary");

  totalRow.appendChild(totalLabelCell);
  totalRow.appendChild(totalScoreCell);
  tableBody.appendChild(totalRow);
});
