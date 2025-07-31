const express = require('express');
const cors = require('cors');

const logRoutes = require('./middleware/logger.js');
const userRouter = require('./routers/userRouter');
const gameRouter = require('./routers/gameRouter');

const app = express();
app.use(express.json());

const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'X-Requested-With', 'Authorization'],
  credentials: false, // change to true if you want to allow cookies
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(logRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    title: "Educational Quiz Game",
    description: "Homepage"
  })
})

app.use('/user', userRouter);
app.use('/game', gameRouter);

module.exports = app;