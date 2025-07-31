const API_URL = 'http://localhost:3000/'

document.getElementById('homebtn').addEventListener('click', async () => {
  window.location.assign("teachers.html");
});

document.getElementById('logoutbtn').addEventListener('click', () => {
  localStorage.removeItem('userID');
  localStorage.removeItem('username');
  localStorage.removeItem('token');
  window.location.assign('login.html');
});

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("add-class-form");
  const classList = document.getElementById("class-list");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const API_URL = 'http://localhost:3000';

    let url = API_URL + `/user/${localStorage.getItem("userID")}/classes`;

    const data = {
      className: document.getElementById("new-class").value.trim(),
      subject: 'Geography'
    }

    const response = await sendPostRequest(url, data);

    if (response.status === 201) {
      const newClass = document.getElementById("new-class").value.trim();
      if (newClass !== "") {
        const li = document.createElement("li");
        li.textContent = newClass;
        li.classList.add("list-group-item");
        classList.appendChild(li);
        form.reset();
      }
    } else if (response.status === 403) {
      localStorage.removeItem('userID');
      localStorage.removeItem('username');
      localStorage.removeItem('token');
      window.location.assign("./login.html");
    }
  });
});

async function getAllClasses() {
  const API_URL = 'http://localhost:3000';

  let url = API_URL + `/user/${localStorage.getItem("userID")}/classes`;

  const response = await getAll(url);

  if (response.status === 200) {
    const classList = document.getElementById("class-list");
    const result = await response.json();
    const classes = result.classes;

    if (classes.length > 0) {
      for (let i in classes) {
        const li = document.createElement("li");
        li.textContent = classes[i].class_name;
        li.classList.add("list-group-item");
        classList.appendChild(li);
      }
    }

  } else if (response.status === 403) {
    localStorage.removeItem('userID');
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    window.location.assign("./login.html");
  }
};

//get stats from students
// pull up top ten students

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

getAllClasses();