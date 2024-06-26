const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const xss = require('xss');
const catchAsync = require('../utils/catchAsync');

exports.createUser = catchAsync(async (req, res, next) => {
  const sanitizedUsername = xss(req.body.username);
  const sanitizedPassword = xss(req.body.password);

  const newUser = await User.create({
    username: sanitizedUsername,
    password: sanitizedPassword,
    highscore: req.body.highscore,
  });

  if (!newUser) {
    res.status(503).json({
      status: 'fail',
      message: 'Server unavailable.',
    });
  }

  const { username, _id, highscore } = newUser;

  res.status(201).json({
    status: 'success',
    data: {
      username,
      objectId: _id,
      highscore,
    },
  });
});

exports.loginUser = catchAsync(async (req, res, next) => {
  const sanitizedUsername = xss(req.body.username);
  const sanitizedPassword = xss(req.body.password);

  const [currentUser] = await User.find({
    username: sanitizedUsername,
  }).select('+password'); // Needed to retrieve the password as response data

  if (!currentUser) {
    res.status(401).json({
      status: 'fail',
      message: 'Please provide your username and password.',
    });
  }

  // Compares the password from the form to the password of the user in the database
  bcrypt.compare(sanitizedPassword, currentUser.password, (err, isMatch) => {
    if (err) {
      res.status(400).json({
        status: 'fail',
        message:
          'Error: Could not log in! Please check the username and password are correct.',
      });
    } else if (!isMatch) {
      res.status(403).json({
        status: 'forbidden',
        message:
          'Could not log in! Please check the username and password are correct.',
      });
    } else if (isMatch) {
      const { username, _id, highscore } = currentUser;
      res.status(200).json({
        status: 'success',
        data: {
          username,
          objectId: _id,
          highscore,
        },
      });
    }
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  // Function that filters the incoming request body (query object) and for each key in that object that matches the allowed fields, it is added into filteredObj..
  //..for example if username, objectId, and cars was included in the body, only the allowed fields added as the param of the function would be added, not cars
  const filterObj = (obj, ...allowedFields) => {
    const filteredObj = {};
    Object.keys(obj).forEach(key => {
      if (allowedFields.includes(key)) filteredObj[key] = obj[key];
    });
    return filteredObj;
  };

  const filteredBody = filterObj(req.body, 'username', 'password', 'highscore');

  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    filteredBody,
    {
      new: true,
      runValidators: true,
    }
  );

  const { username, _id, highscore } = updatedUser;

  res.status(200).json({
    status: 'success',
    message: 'User updated.',
    data: {
      username,
      objectId: _id,
      highscore,
    },
  });
});

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    data: {
      users,
    },
  });
});

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id);
});
