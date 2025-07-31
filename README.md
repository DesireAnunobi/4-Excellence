# 4-Excellence Educational Application

An educational game app for secondary schools. This application aims to restore the interest of people in non-STEM subjects, by putting student enjoyment at the heart of learning experience, whilst sharing the burden of education with teachers. 

This application allows students to create an account on the app (whilst teachers will need to have their accounts created by the database administrator). Both students and teachers can then login to access separate components of the app:
- Students can access and play a collection of educational games on non-STEM subjects. Currently available games are: KS3 History Quiz & KS3 Geography Quiz
- Students can then check their personal profile, which also holds their last score, best score and average score per game.
- Teachers can access their personal profile, from which they can create classes and assign students to classes. They can then monitor the performance of students in their classes.

This repository holds both the front-end and back-end components of the application.
- The website folder holds a static website, hosted on [Render](add a link here).
- The server folder holds the server of the application, which is hosted locally by the school, in their cloud provider of choice (e.g. [Render](add a link here)).
- The server folder also holds a database folder, which takes care of setting up a connection to a Supabase-hosted database. Schools will need to set up their own Supabase to run this.


# Server

This section covers all content in the `/server` directory.

## Package.json Scripts

The following npm scripts are available for development and deployment:

```json
"scripts": {
  "start": "node index.js",
  "dev": "nodemon index.js",
  "setup-db": "node ./db/setup.js",
  "live": "live-server",
  "test": "jest --watchAll --verbose --detectOpenHandles --runInBand",
  "coverage": "jest --coverage"
}
```

### How to Run Scripts

| Command | Script | Description |
|---------|--------|-------------|
| `npm run dev` | nodemon | Start development server with auto-reload |
| `npm run live` | live-server | Launch live development server |
| `npm run setup-db` | database setup | Initialise and populate database |
| `npm start` | production | Start production server |
| `npm test` | testing | Run test suite with watch mode |
| `npm run coverage` | test coverage | Generate test coverage report |

## Database Connection

The database connection system utilises three core files:

### Core Files
- **`connect.js`** - Establishes database connection using the URL from `.env`, with CORS and Express framework integration
- **`setup.js`** - Initialises and populates database using the `setUpAll()` function
- **`setup.sql`** - Contains SQL commands to create all necessary application tables

### Setting Up Database Connection

Follow these steps to establish a database connection:

1. **Navigate to server directory**
   ```bash
   cd server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   - Create a `.env` file in the `/server` folder
   - Add the following configuration:
   ```env
   PORT=[desired_port_number]
   DB_URL=[database_url]
   ```

4. **Initialise database**
   ```bash
   npm run setup-db
   ```

## API Functionality

The API architecture is organised into two main categories:

### Router Structure
- **Game Router** (`routers/gameRouter`) - Handles game-specific endpoints and logic
- **User Router** (`routers/userRouter`) - Manages user-specific operations and authentication

### Architecture Pattern
Each router utilises controller functions to process requests and responses, which then interact with their corresponding model functions for data operations.

### Documentation
Access comprehensive API documentation with example HTTP requests:
> **[API Endpoints Documentation](server/api-endpoints.md)**


