const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

// Scheme { definition }, { options }
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'A user must have a username.'],
    unique: true,
    validator: function (value) {
      return validator.isAlpha(value, 'en-US', { ignore: ' ' }); // allows spaces, if you want to allow spaces
    },
  },
  password: {
    type: String,
    required: [true, 'A user must have a password.'],
    minLength: 8,
    select: false,
    validate: {
      validator: function (password) {
        return validator.isAlphanumeric(password, 'en-US');
      },
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
