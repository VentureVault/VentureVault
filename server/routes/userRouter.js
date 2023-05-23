const express = require('express');
const userController = require('../controllers/userController');
const userRouter = express.Router();

//Add routes here!

// user login route
 
// user signup route

// These are all tests, delete and change when you like!
const data = {
  message: 'I\'m the one you want',
}

userRouter.get('/', (req, res) => {
  console.log(data)
  res.status(200).json(data)
});

// userRouter.post('/database-data',
// userController.checkUsername,
//   (req, res) => {
//   res.status(200).json(res.locals)
// });

module.exports = userRouter;