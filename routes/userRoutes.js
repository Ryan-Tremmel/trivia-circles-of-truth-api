const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();

router.post('/signup', userController.createUser);
router.post('/login', userController.loginUser);

router.route('/').get(userController.getAllUsers);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser);
/*
  .delete(userController.deleteUser); // Not in use - delete at database
  */
module.exports = router;
