# 4-Excellence Back-End API Documentation

A comprehensive REST API for managing educational games, users, classes, and student statistics.

---

## 📚 Table of Contents

- [User Management](#-user-management)
- [Game Management](#-game-management)
- [Installation](#-installation)
- [Base URL](#-base-url)

---

## 🔗 Base URL

```
http://localhost:3007
```

---

## 👥 User Management

### Get Student Statistics
**`GET /user/student/:id/stats`**

Retrieves all game statistics for a specific student.

**Parameters:**
- `id` (path) - Student ID

**Example Request:**
```http
GET /user/student/1/stats
```

**Response:**
```json
[
  {
    "student_id": 1,
    "game_id": 5,
    "times_played": 7,
    "avg_score": 92,
    "best_score": 98,
    "last_score": 95
  },
  {
    "student_id": 1,
    "game_id": 4,
    "times_played": 3,
    "avg_score": 78,
    "best_score": 88,
    "last_score": 82
  },
  {
    "student_id": 1,
    "game_id": 1,
    "times_played": 5,
    "avg_score": 85,
    "best_score": 95,
    "last_score": 90
  }
]
```

---

### Get User Information
**`GET /user/:id`**

Retrieves basic user information.

**Parameters:**
- `id` (path) - User ID

**Example Request:**
```http
GET /user/1
```

**Response:**
```json
[
  {
    "username": "sarah_johnson",
    "is_teacher": true
  }
]
```

---

### Get Classes by Teacher
**`GET /user/:teacherid/:id/classes`**

Retrieves all classes for a specific teacher.

**Parameters:**
- `teacherid` (path) - Teacher ID
- `id` (path) - Additional ID parameter

**Example Request:**
```http
GET /user/2/4/classes
```

**Response:**
```json
[
  {
    "class_name": "Algebra I"
  },
  {
    "class_name": "Biology Basics"
  },
  {
    "class_name": "Creative Writing"
  },
  {
    "class_name": "European History"
  },
  {
    "class_name": "Geometry"
  },
  {
    "class_name": "Physical Science"
  }
]
```

---

### Get Students in Class
**`GET /user/students/classes/:id`**

Retrieves all students enrolled in a specific class.

**Parameters:**
- `id` (path) - Class ID

**Example Request:**
```http
GET /user/students/classes/4
```

**Response:**
```json
{
  "class_name": "Algebra I",
  "students_names": [
    "alice_cooper"
  ]
}
```

---

### Get All Classes for Teacher
**`GET /user/:teacherid/allclasses`**

Retrieves all classes managed by a teacher.

**Parameters:**
- `teacherid` (path) - Teacher ID

**Example Request:**
```http
GET /user/3/allclasses
```

**Response:**
```json
[
  {
    "class_name": "Algebra I"
  },
  {
    "class_name": "Biology Basics"
  },
  {
    "class_name": "Creative Writing"
  },
  {
    "class_name": "European History"
  },
  {
    "class_name": "Geometry"
  },
  {
    "class_name": "Physical Science"
  }
]
```

---

### User Signup
**`POST /user/signup`**

Creates a new user account.

**Example Request:**
```http
POST /user/signup
Content-Type: application/json

{
  "username": "hello",
  "password": "password"
}
```

**Response:**
```json
{
  "user_id": 18,
  "username": "hello",
  "password_hash": "$2b$10$AMf4.C.r7i/42A.TrXWWB.5Ro1vBQD5hwsJtTltftWEdsgI.gnt5C",
  "is_teacher": false,
  "student_id": 13,
  "role": "student"
}
```

---

### User Login
**`POST /user/login`**

Authenticates user credentials.

**Example Request:**
```http
POST /user/login
Content-Type: application/json

{
  "username": "hello",
  "password": "password"
}
```

**Response:**
```json
true
```

---

### Create Class
**`POST /user/:teacherid/classes`**

Creates a new class for a teacher.

**Parameters:**
- `teacherid` (path) - Teacher ID

**Example Request:**
```http
POST /user/3/classes
Content-Type: application/json

{
  "className": "hello",
  "subjectChoice": "Art"
}
```

**Response:**
```json
{
  "class_id": 17,
  "class_name": "hello",
  "subject_id": 5
}
```

---

### Delete User
**`DELETE /user/:username`**

Deletes a user account.

**Parameters:**
- `username` (path) - Username to delete

**Example Request:**
```http
DELETE /user/hello
```

**Response:**
```json
{
  "message": "User deleted successfully",
  "deletedUsername": "hello",
  "deletedAt": "2025-07-30T15:33:36.986Z"
}
```

---

### Delete Class
**`DELETE /user/:teacherid/classes/:class`**

Deletes a class.

**Parameters:**
- `teacherid` (path) - Teacher ID
- `class` (path) - Class ID

**Example Request:**
```http
DELETE /user/3/classes/5
```

**Response:**
```json
{
  "success": true,
  "message": "Class deleted successfully"
}
```

---

### Update Class Details
**`PATCH /user/:teacherid/classes/:class`**

Updates class information.

**Parameters:**
- `teacherid` (path) - Teacher ID
- `class` (path) - Class ID

**Example Request:**
```http
PATCH /user/3/classes/5
Content-Type: application/json

{
  "className": "changed"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Class updated successfully"
}
```

---

## 🎮 Game Management

### Start Game
**`POST /game/:gameID`**

Initializes a new game session and returns game details with questions.

**Parameters:**
- `gameID` (path) - Game ID

**Example Request:**
```http
POST /game/2
Content-Type: application/json

{
  "studentID": 1
}
```

**Response:**
```json
{
  "message": "Game started successfully",
  "data": {
    "gameId": 2,
    "gameName": "History Explorer",
    "gameType": "Quiz",
    "subjectId": 2,
    "subjectName": "Science",
    "studentId": 1,
    "startTime": "2025-07-31T09:27:08.983Z",
    "questions": [
      {
        "id": 3,
        "question": "What is the chemical symbol for water?",
        "options": [
          "H2O",
          "CO2",
          "NaCl",
          "O2"
        ],
        "difficulty": "Easy",
        "topic": "Chemistry"
      }
    ],
    "totalQuestions": 1
  }
}
```

---

### End Game
**`POST /game/:gameID/ended`**

Finalizes a game session and updates student statistics.

**Parameters:**
- `gameID` (path) - Game ID

**Example Request:**
```http
POST /game/1/ended
Content-Type: application/json

{
  "studentId": 5,
  "finalScore": 85,
  "questionsAnswered": 10,
  "correctAnswers": 8
}
```

**Response:**
```json
{
  "gameId": 1,
  "studentId": 5,
  "finalScore": 85,
  "questionsAnswered": 10,
  "correctAnswers": 8,
  "accuracy": 80,
  "stats": {
    "timesPlayed": 3,
    "averageScore": 85,
    "bestScore": 85,
    "lastScore": 85
  }
}
```

---

### Get Random Questions (Any Type/Subject)
**`GET /game/qs`**

Returns 10 completely random questions from any subject and question type.

**Example Request:**
```http
GET /game/qs
```

**Response:**
```json
[
  {
    "id": 2,
    "question": "What is 15 + 27?",
    "answer": "42",
    "options": [
      "42",
      "41",
      "43",
      "44"
    ],
    "difficulty": "Easy",
    "topic": "Arithmetic"
  },
  {
    "id": 1,
    "question": "What is the capital of France?",
    "answer": "Paris",
    "options": [
      "Paris",
      "London",
      "Berlin",
      "Madrid"
    ],
    "difficulty": "Easy",
    "topic": "European Capitals"
  },
  {
    "id": 3,
    "question": "What is the chemical symbol for water?",
    "answer": "H2O",
    "options": [
      "H2O",
      "CO2",
      "NaCl",
      "O2"
    ],
    "difficulty": "Easy",
    "topic": "Chemistry"
  }
]
```

---

### Get Random Questions (Specific Type/Subject)
**`GET /game/qs/:type/:subject`**

Returns 10 random questions filtered by question type and subject.

**Parameters:**
- `type` (path) - Question type (e.g., "multiplechoice")
- `subject` (path) - Subject name (e.g., "Mathematics")

**Example Request:**
```http
GET /game/qs/multiplechoice/Mathematics
```

**Response:**
```json
[
  {
    "id": 1,
    "question": "What is the capital of France?",
    "answer": "Paris",
    "options": [
      "Paris",
      "London",
      "Berlin",
      "Madrid"
    ],
    "difficulty": "Easy",
    "topic": "European Capitals"
  },
  {
    "id": 2,
    "question": "What is 15 + 27?",
    "answer": "42",
    "options": [
      "42",
      "41",
      "43",
      "44"
    ],
    "difficulty": "Easy",
    "topic": "Arithmetic"
  }
]
```

