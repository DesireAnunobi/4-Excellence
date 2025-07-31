document.getElementById("studentlogin").addEventListener("click", async () => {
    const API_URL = 'http://localhost:3000';
    const is_teacher = false;

    const username = document.getElementById("userid").value;
    const password = document.getElementById("password").value;

    const data = {
        username: username,
        password: password,
        is_teacher: is_teacher
    }

    if (username.length > 0 && password.length > 0) {
        let url = API_URL + '/user/login';

        const response = await sendPostRequest(url, data);
        const result = await response.json();

        if (response.status == 200) {
            localStorage.setItem("userID", result.userID);
            localStorage.setItem("username", result.username);
            localStorage.setItem("token", result.token);
            window.location.assign("students.html");
        
        } else {
            alert(result.error);
        }
    };

    document.getElementById("userid").value = '';
    document.getElementById("password").value = '';
})

document.getElementById("teacherlogin").addEventListener("click", async () => {
    const API_URL = 'http://localhost:3000';
    const is_teacher = true;

    const username = document.getElementById("userid").value;
    const password = document.getElementById("password").value;

    const data = {
        username: username,
        password: password,
        is_teacher: is_teacher
    }

    if (username.length > 0 && password.length > 0) {
        let url = API_URL + '/user/login';
        
        const response = await sendPostRequest(url, data);
        const result = await response.json();

        if (response.status == 200) {
            localStorage.setItem("userID", result.userID);
            localStorage.setItem("username", result.username);
            localStorage.setItem("token", result.token);
            window.location.assign("teachers.html");
        
        } else {
            alert(result.error);
        }
    };

    document.getElementById("userid").value = '';
    document.getElementById("password").value = '';
})

async function sendPostRequest(url, data) {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    }

    const resp = await fetch(url, options);

    return resp;
};