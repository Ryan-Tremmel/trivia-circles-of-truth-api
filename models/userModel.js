const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

// Scheme { definition }, { options }
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'A user must have a username.'],
    unique: true,
    validate: {
      validator: function (value) {
        return validator.isAlpha(value, 'en-US', { ignore: ' ' }); // allows spaces, if you want to allow spaces
      },
      message: 'Username can only contain letters and spaces.'
    },
  },
  password: {
    type: String,
    required: [true, 'A user must have a password.'],
    minLength: [8, 'Password must be at least 8 characters long.'],
    select: false,
    validate: {
      validator: function (password) {
        // Allow letters, numbers, and common special characters
        return /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]+$/.test(password);
      },
      message: 'Password can contain letters, numbers, and special characters.'
    },
  },
  highscore: {
    type: Number,
    required: false,
  },
});

// Encrypts password RIGHT after creating the user and between saving it to the database only if the password hasn't been modified
userSchema.pre('save', async function (next) {
  // Hashes password at the cost of 12 (cost of cpu usage - higher = better hash, more powerful cpu needed)
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
