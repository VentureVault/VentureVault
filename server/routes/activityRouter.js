const express = require('express');
const activityController = require('../controllers/activityController');
const activityRouter = express.Router();

//Add routes here!

// get Activity
activityRouter.get('/',
activityController.getActivities,
  (req, res) => {
    //console.log('--Sending data from GET request from /api/activity/--',res.locals.afterGet);
    return res.status(200).json(res.locals.afterGet);
  }
);
// post Activity
activityRouter.post('/',
  activityController.postActivity,
  // activityController.getActivities,
  (req, res) => {
    //console.log('--Sending data from POST request from /api/activity/--',res.locals.afterGet);
    return res.status(200).json(res.locals.afterGet);
  }
);

// delete Activity
activityRouter.delete('/',
activityController.deleteActivity,
//activityController.getActivities,
  (req, res) => {
    //console.log('--Sending data from DELETE request from /api/activity/--',res.locals.afterGet);
    return res.status(200).json(res.locals.afterGet);
  }
);


module.exports = activityRouter;