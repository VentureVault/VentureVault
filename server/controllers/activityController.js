const db = require('../models/vaultModel.js');

const activityController = {};

//Add controllers here!

//get controller

activityController.getActivities = (req, res, next) => {
  const { username } = req.body;
  //const { first_name } = req.body;
  const queryString = 
    //`SELECT * FROM activities`
  `SELECT activity_name, completed, activities.id as activity_id, location_name, category_name, url FROM activities
  JOIN users_activities ON activities.id = users_activities.activity_id
  JOIN user_info ON users_activities.user_info_id = user_info.id
  JOIN activity_locations ON activities.id = activity_locations.activity_id
  JOIN locations ON activity_locations.location_id = locations.id
  JOIN activity_category ON activities.id = activity_category.activity_id
  JOIN category ON activity_category.category_id = category.id
  JOIN activity_detail_urls ON activities.id = activity_detail_urls.activity_id
  JOIN detail_urls ON activity_detail_urls.detail_url_id = detail_urls.id
  WHERE username = $1`
  db.query(queryString, [username])
  .then(data => {
    // console.log('data.rows in activityController.getActivities', data.rows);
    const cache = {}
    data.rows.forEach(row => {
      if (!cache[row.activity_id]) {
        cache[row.activity_id] = [];
      } 
      cache[row.activity_id].push(row.url);
    })
    const keys = Object.keys(cache).map( key => Number(key));
    const activityArray = keys.map(key => {
      let activityObj;
      for (const activity of data.rows) {
        if (key === activity.activity_id) {
          const {
            activity_name: activityName,
            activity_id: activityId,
            completed,
            location_name: locationName,
            category_name: categoryName
          } = activity;

          activityObj = { activityName, completed, activityId, locationName, categoryName };
          
          break;
        }
      }
      activityObj.urls = cache[key];
      return activityObj;
    });
    
    res.locals.afterGet = activityArray
    console.log(activityArray);
    return next(); 
  })
  .catch((err) => {
		return next({
			log: `activityController.getActivities middleware error: ${err.message}`,
			status: 501,
			message:'Failed to execute query to GET all activities',
		});
	});
}

//post controller 
activityController.postActivity = (req, res, next) => {
  const { username, activity_name, category_name, urls } = req.body;
  const queryString = ``
 db.query(queryString, [username])
  .then(data => {
    console.log('data.rows in activityController.postActivity', data.rows);
    res.locals.afterPost = data.rows
    return next(); 
  })
  .catch((err) => {
		return next({
			log: `activityController.postActivity middleware error: ${err.message}`,
			status: 501,
			message:'Failed to execute query to POST all activities',
		});
	});
}

//delete controller 
activityController.deleteActivity = (req, res, next) => {
  const { username, activity_id } = req.body;
  const queryString = ``
 db.query(queryString, [username])
  .then(data => {
    console.log('data.rows in activityController.deleteActivity', data.rows);
    res.locals.afterDelete = data.rows
    return next(); 
  })
  .catch((err) => {
		return next({
			log: `activityController.deleteActivity middleware error: ${err.message}`,
			status: 501,
			message:'Failed to execute query to DELETE all activities',
		});
	});
}

module.exports = activityController;