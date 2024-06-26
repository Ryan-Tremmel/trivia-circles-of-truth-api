const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Connects the config.env to our application using dotenv npm package
// Needs to be before we require app
dotenv.config({
  path: './config.env',
});

console.log(process.env.NODE_ENV);
const app = require('./app');

// Handles uncaught exceptions by listening for uncaughtException event
process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! Shutting down...');
  console.log(err);
  process.exit(1);
});

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

// Async function for connecting to our MongoDB server
async function dbConnect() {
  await mongoose.connect(DB);
}
dbConnect();

app.get('/message', (req, res) => {
  res.json({ message: 'Hello from server!' });
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port 8000.`);
});
