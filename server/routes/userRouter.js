const express = require('express');
const userController = require('../controllers/userController');
const userRouter = express.Router();


// user login route
userRouter.post('/login',
userController.userVarification,
  (req, res) => {
    //console.log('--Sending data from POST request from /api/user/login',res.locals);
    return res.status(200).json(res.locals.user);
  }
);
// user signup route
userRouter.post('/signup',
userController.checkUsername,
userController.userSignup,
  (req, res) => {
    //console.log('--Sending data from POST request from /api/user/signup',res.locals);
    return res.status(200).json(res.locals.user);
  }
);


module.exports = userRouter;