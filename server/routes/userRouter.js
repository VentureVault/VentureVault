const express = require('express');
const userController = require('../controllers/userController');
const userRouter = express.Router();

//Add routes here!

// user login route
userRouter.post('/login',
userController.userVarification,
  (req, res) => {
    console.log('--Sending data from POST request from /api/user/login',res.locals);
    return res.status(200).json(res.locals);
  }
);
// user signup route
userRouter.post('/signup',
userController.userSignup,
  (req, res) => {
    console.log('--Sending data from POST request from /api/user/signup',res.locals);
    return res.status(200).json(res.locals);
  }
);
//These are all tests, delete and change when you like!
// const data = {
//   message: 'I\'m the one you want',
// }

// userRouter.get('/', (req, res) => {
//   console.log(data)
//   res.status(200).json(data)
// });

// userRouter.post('/database-data',
// userController.checkUsername,
//   (req, res) => {
//   res.status(200).json(res.locals)
// });

module.exports = userRouter;