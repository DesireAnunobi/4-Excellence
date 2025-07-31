document.getElementById('homebtn').addEventListener('click', async () => {
  window.location.assign("students.html");
});

document.getElementById('logoutbtn').addEventListener('click', () => {
  localStorage.removeItem('userID');
  localStorage.removeItem('username');
  localStorage.removeItem('token');
  window.location.assign('login.html');
});

document.getElementById('geoquiz').addEventListener('click', () => {
  window.location.assign(`game.html?game=geography`);
});

document.getElementById('histquiz').addEventListener('click', () => {
  window.location.assign(`game.html?game=history`);
});

async function getUserDetails() {
  const API_URL = 'http://localhost:3000';

  let url = API_URL + `/user/student/${localStorage.getItem("userID")}/stats`;

  const response = await getAll(url);
  
  if (response.status === 200) {
    const stats = await response.json();

    document.getElementById("geography-best").textContent = "Geography Quiz – " + stats[0].best_score + " / 10";
    document.getElementById("history-best").textContent = "History Quiz – " + stats[1].best_score + " / 10";
    document.getElementById("geography-last").textContent = "Geography Quiz – " + stats[0].last_score + " / 10";
    document.getElementById("history-last").textContent = "History Quiz – " + stats[1].last_score + " / 10";
  } else {
    localStorage.removeItem('userID');
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    window.location.assign("./login.html");
  }
}

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

getUserDetails();