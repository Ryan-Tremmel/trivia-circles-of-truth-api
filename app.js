const express = require('express');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');
const userRouter = require('./routes/userRoutes');

const app = express();

app.use(
  cors({
    origin: [
      'https://trivia-circles-of-truth.onrender.com',
      'https://trivia-circles-of-truth-develop.onrender.com'
    ], // Allow both production and development origins
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

// Global error handling middleware (must be after all routes)
app.use((err, req, res, next) => {
  console.log('Global error handler:', err);
  
  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(el => el.message);
    const message = errors.join('. ');
    return res.status(400).json({
      status: 'fail',
      message: message
    });
  }
  
  // Handle Mongoose duplicate key errors
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const capitalizedField = field[0].toUpperCase() + field.slice(1);
    const message = `${capitalizedField} already exists.`;
    return res.status(400).json({
      status: 'fail',
      message: message
    });
  }
  
  // Handle other errors
  res.status(err.statusCode || 500).json({
    status: 'error',
    message: err.message || 'Something went wrong!'
  });
});

module.exports = app;
