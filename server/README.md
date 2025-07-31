# 4-Excellence Back-End Server & Database

This is the server of the 4-Excellence application. Individual schools can clone this server and run it in the cloud provider of their choice. The server consists of a RESTful API running on Node.js and built using Express.js. It also offers a database file that opens a connection to a Supabase-hosted database. Individual schools will need to create a Supabase database of their own in order to run the database. 

## Package.json Scripts

The following npm scripts are available for development and deployment:

```json
"scripts": {
  "start": "node index.js",
  "dev": "nodemon index.js",
  "setup-db": "node ./db/setup.js",
}
```

### How to Run Scripts

| Command | Script | Description |
|---------|--------|-------------|
| `npm run dev` | nodemon | Start development server with auto-reload |
| `npm run setup-db` | database setup | Initialise and populate database |
| `npm start` | production | Start production server |

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

