const express = require('express');
const activityController = require('../controllers/activityController');
const activityRouter = express.Router();


activityRouter.post('/get-by-category',
activityController.getActivitiesByCategory,
  (req, res) => {
    //console.log('--Sending data from GET request from /api/activity/--',res.locals.afterGet);
    return res.status(200).json(res.locals.afterGet);
  }
);


// get Activity
activityRouter.post('/get-all',
activityController.getActivities,
  (req, res) => {
    //console.log('--Sending data from GET request from /api/activity/--',res.locals.afterGet);
    return res.status(200).json(res.locals.afterGet);
  }
);


// add Activity
activityRouter.post('/add-activity',
  activityController.postActivity,
  activityController.getActivitiesByCategory,
  (req, res) => {
    //console.log('--Sending data from POST request from /api/activity/--',res.locals.afterGet);
    return res.status(200).json(res.locals.afterGet);
  }
);


// patch Activity
activityRouter.patch('/',
activityController.updateActivity,
//activityController.getActivities,
  (req, res) => {
    //console.log('--Sending data from DELETE request from /api/activity/--',res.locals.afterGet);
    return res.status(200).json(res.locals.afterDelete);
  }
);


module.exports = activityRouter;