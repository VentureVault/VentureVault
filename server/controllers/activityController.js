const db = require('../models/vaultModel.js');

const activityController = {};

//Add controllers here!

//get controller

activityController.getActivities = (req, res, next) => {
  
  const username = req.body.username || req.params.username;

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


const urlQueryBuilder = async (urlArray, activity_id) => {
  for (const url of urlArray) {
    const urlQuery = `INSERT INTO detail_urls (url) VALUES ($1)
                       RETURNING id;`
    
    const urlData = await db.query(urlQuery, [url]);
    const url_id = urlData.rows[0].id;

    console.log('url_id', url_id);
    
    const urlJoinTableQuery = `INSERT INTO activity_detail_urls (activity_id, detail_url_id) VALUES ($1, $2) RETURNING *`;
    const urlJoinTableData = await db.query(urlJoinTableQuery, [activity_id, url_id]);

    console.log('urlJoinTableData', urlJoinTableData.rows);
  }
}


//post controller 
activityController.postActivity = async (req, res, next) => {
  const { username, activity_name, category_name, urls } = req.body;

  let user_id, activity_id, category_id;
  
  try {

    const queryString0 = `SELECT id FROM user_info
                          WHERE username = $1;`

    const userData = await db.query(queryString0, [username]);

    user_id = userData.rows[0].id;
    console.log('user_id', user_id);
 
    const queryString1 = `INSERT INTO activities (activity_name) VALUES ($1)
                          RETURNING id;`

    const activityData = await db.query(queryString1, [activity_name]);

    activity_id = activityData.rows[0].id
    console.log('activity_id', activity_id);

    const queryString2 = `INSERT INTO category (category_name) VALUES ($1)
                          RETURNING id;`

    const categoryData = await db.query(queryString2, [category_name])

    category_id = categoryData.rows[0].id
    console.log('category_id', category_id);
    
    const queryString3 = `INSERT INTO users_activities (user_info_id, activity_id) VALUES ($1, $2) RETURNING *`

    const userInfoActivities = await db.query(queryString3, [user_id, activity_id])
    
    console.log('returning from users_activities',userInfoActivities.rows)

    const queryString4  = `INSERT INTO activity_category (category_id, activity_id) VALUES ($1, $2) 
    RETURNING *`
    
    const activitiesCategory = await db.query(queryString4, [category_id, activity_id])

    console.log('returning from activity_category',activitiesCategory.rows)

    urlQueryBuilder(urls, activity_id);

    return next();
    
  } catch (err) {
      return next({
        log: `activityController.postActivity middleware error: ${err.message}`,
        status: 501,
        message: 'Failed to execute query to POST all activities',
      });
    }
  };
  

//update controller 
activityController.updateActivity = (req, res, next) => {
  const { completed, activity_id } = req.body;
  
  const queryString = `UPDATE activities SET completed = $1 WHERE id = $2 RETURNING *`
 db.query(queryString, [!completed, activity_id])
  .then(data => {
    console.log('data.rows in activityController.updateActivity', data.rows);
    res.locals.afterUpdate = data.rows
    return next(); 
  })
  .catch((err) => {
		return next({
			log: `activityController.updateActivity middleware error: ${err.message}`,
			status: 501,
			message:'Failed to execute query to UPDATE activities',
		});
	});
}

//delete controller 
activityController.deleteActivity = (req, res, next) => {
  const { completed, activity_id } = req.body;
}

module.exports = activityController;