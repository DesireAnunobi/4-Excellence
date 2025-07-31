

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

SET default_tablespace = '';
SET default_with_oids = false;



DROP TABLE IF EXISTS Student_Stats CASCADE;
DROP TABLE IF EXISTS Students_To_Classes CASCADE;
DROP TABLE IF EXISTS Games_To_Classes CASCADE;
DROP TABLE IF EXISTS Quiz_Questions CASCADE;
DROP TABLE IF EXISTS Quiz_Games CASCADE;
DROP TABLE IF EXISTS Games CASCADE;
DROP TABLE IF EXISTS Classes CASCADE;
DROP TABLE IF EXISTS Students CASCADE;
DROP TABLE IF EXISTS Teachers CASCADE;
DROP TABLE IF EXISTS Users CASCADE;
DROP TABLE IF EXISTS Subjects CASCADE;

s
CREATE TABLE Users(
  user_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  password_hash VARCHAR(255) NOT NULL, 
  is_teacher BOOLEAN NOT NULL
);

CREATE TABLE Subjects(
  subject_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  subject VARCHAR(50) NOT NULL
);

-- Tables that depend on Users
CREATE TABLE Teachers (
  teacher_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id INT NOT NULL,
  school_name VARCHAR(50) NOT NULL,
  CONSTRAINT fk_teacher_user
    FOREIGN KEY (user_id)
    REFERENCES Users(user_id)
    ON DELETE CASCADE
);

CREATE TABLE Students(
  student_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id INT NOT NULL,
  CONSTRAINT fk_student_user
    FOREIGN KEY (user_id)
    REFERENCES Users(user_id)
    ON DELETE CASCADE
);

-- Tables that depend on Teachers and Subjects
CREATE TABLE Classes(
  class_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  class_name VARCHAR(50) NOT NULL,
  teacher_id INT NOT NULL,
  subject_id INT NOT NULL ,
  CONSTRAINT fk_class_teacher
    FOREIGN KEY (teacher_id)
    REFERENCES Teachers(teacher_id)
    ON DELETE CASCADE,
  CONSTRAINT fk_class_subject
    FOREIGN KEY (subject_id)
    REFERENCES Subjects(subject_id)
    ON DELETE CASCADE
);

-- Games table (depends on Subjects)
CREATE TABLE Games (
    game_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    game_name VARCHAR(50) NOT NULL,
    game_type VARCHAR(50) NOT NULL,
    subject_id INT REFERENCES Subjects(subject_id) ON DELETE CASCADE
);

-- Quiz_Games table (depends on Games)
CREATE TABLE Quiz_Games (
    game_id INT PRIMARY KEY REFERENCES Games(game_id) ON DELETE CASCADE
);

-- Quiz_Questions table (depends on Quiz_Games and Subjects)
CREATE TABLE Quiz_Questions (
    question_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    game_id INT REFERENCES Quiz_Games(game_id) ON DELETE CASCADE,
    subject_id INT REFERENCES Subjects(subject_id) ON DELETE CASCADE,
    question VARCHAR(150) NOT NULL,
    options JSONB NOT NULL,
    answer VARCHAR(50) NOT NULL,
    topic VARCHAR(30) NOT NULL,
    subcategory VARCHAR(30) NOT NULL,
    question_type VARCHAR(30) NOT NULL,
    difficulty VARCHAR(30) NOT NULL
);

-- Junction tables (depend on multiple tables)
CREATE TABLE Students_To_Classes (
    student_id INT REFERENCES Students(student_id) ON DELETE CASCADE,
    class_id INT REFERENCES Classes(class_id) ON DELETE CASCADE,
    PRIMARY KEY (student_id, class_id)
);

CREATE TABLE Games_To_Classes (
    game_id INT REFERENCES Games(game_id) ON DELETE CASCADE,
    class_id INT REFERENCES Classes(class_id) ON DELETE CASCADE,
    PRIMARY KEY (game_id, class_id)
);

-- Stats table (depends on Students and Games)
CREATE TABLE Student_Stats(
  student_id INT NOT NULL,
  game_id INT NOT NULL,
  times_played SMALLINT DEFAULT 0,
  avg_score SMALLINT DEFAULT 0,
  best_score SMALLINT DEFAULT 0,
  last_score SMALLINT DEFAULT 0,
  CONSTRAINT pk_student_stats PRIMARY KEY (student_id, game_id),
  CONSTRAINT fk_student_stats_student FOREIGN KEY (student_id)
      REFERENCES Students(student_id)
      ON DELETE CASCADE,
  CONSTRAINT fk_student_stats_game FOREIGN KEY (game_id)
      REFERENCES Games(game_id)
      ON DELETE CASCADE
);


-- sample data


INSERT INTO subjects (subject) 
VALUES 
  ('Geography'),
  ('History'),
  ('Literature');

INSERT INTO Games (game_name, game_type, subject_id) 
VALUES
  ('Geography Quiz', 'Quiz', 1),
  ('History Quiz', 'Quiz', 2),
  ('Literature Quiz', 'Quiz', 3);

INSERT INTO Quiz_Games (game_id) 
VALUES 
  (1),
  (2),
  (3);