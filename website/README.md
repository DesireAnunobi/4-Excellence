# 4-Excellence Educational Application

## Overview

The management team at the Hive group of secondary schools has observed a significant decline in engagement with non-STEM subjects over the past two years. To address this, they commissioned 4Excellence to design a solution that places student enjoyment at the centre of the learning experience.

Our mission is to create an engaging, game-based educational platform that helps students rediscover enjoyment and improve retention in non-STEM subjects, all in the pursuit of learning 4Excellence.

## Goals

- Enhance student engagement through interactive learning.
- Provide variety in lesson activities to avoid repetition.
- Align with the National KS3 Curriculum.
- Foster critical thinking and deeper understanding in non-STEM disciplines.

## Features

**4Excellence** is a full-stack application designed to support students and teachers with distinct functionalities:

### For Students:

- Create an account and log in to access educational quizzes focused on revising non-STEM subjects.
- Currently available games include:

  - KS3 History Quiz
  - KS3 Geography Quiz

- View a personal dashboard that tracks:
  - Last score
  - Best score

### For Teachers:

- Log in to an account created by IT department.
- Access a personal dashboard to:
    - View top student scores

## Project Structure

This repository includes:
- **Website folder** – Contains a static front-end site hosted on Render
- **Server folder** – Hosts the back-end server, intended to be deployed locally by the school 
- **Database folder (inside the server)** – Manages connections to a Supabase-hosted database. Schools must configure their own Supabase database to run the application.

## Website Functionality

The website serves as the main user interface. It allows:

- Students to register, log in, play quizzes, and view recent and highest scores on the dashboard
- Teachers to log in and track student progress.

The website is live and accessible online hosted on https://four-excellence-website.onrender.com

### Tech Stack
- HTML, CSS, Bootstrap, Javascript
- database -supabass
- bcrypt, cors, dotenv, express, jsonwebtoken, pg, nodemon
- jest, superjest

## What we learned

Working as a team helped us improve our communication and task delegation, which were essential for staying on track and meeting our objectives. We learnt to use resources such as Trello to create a Kanban board to keep track of tasks.

We developed confidence using GitHub for efficient version control in a collaborative environment. This included managing branches, resolving merge conflicts, and maintaining a clean commit history across a multi-component project.

Initially, we were overly ambitious with the range of features we aimed to implement. We quickly learned the importance of prioritising a Minimum Viable Product, delivering core functionality first before expanding features.

Throughout development, we encountered a range of issues. Solving them improved our ability to diagnose problems systematically. At times, stepping away and revisiting code with fresh eyes proved invaluable.
e learned how to test individual functions and application features thoroughly to ensure they behaved as expected, helping us catch issues early and maintain stability.


#### <p style="text-align:center;">★4Excellence</p>