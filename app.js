const express = require('express');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const userRouter = require('./routes/userRoutes');

const app = express();

app.use(
  cors({
    origin: 'https://trivia-circles-of-truth.onrender.com', // Allow only this origin
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'], // Allow specific HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
  })
);

// Used to parse incoming requests, adding the body (based on body-parser) as well as limited that body to 50kb of data - VERY IMPORTANT //////////////////////////////
app.use(
  express.json({
    limit: '50kb',
  })
);

// Sanitizes data in body of requests...
// 1) Against NoSQL Query Injection
app.use(mongoSanitize());

// Used to parse form data
app.use(express.urlencoded({ extended: true, limit: '50kb' }));

// Mounts router
app.use('/trivia/api/users', userRouter);

module.exports = app;
