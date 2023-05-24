const db = require('../models/vaultModel.js');

const activityController = {};


//---GET ACTIVITIES------------------------------------------------------------------------------------------------------------------------
// get all activities for a user
activityController.getActivities = (req, res, next) => {
  
  const username = req.body.username //|| req.params.username;
  console.log('username from getActivities', username);
  const queryString = 
  `SELECT activity_name, completed, activities.id as activity_id, location_name, category_name, url FROM activities
  JOIN users_activities ON activities.id = users_activities.activity_id
  JOIN user_info ON users_activities.user_info_id = user_info.id
  LEFT JOIN activity_locations ON activities.id = activity_locations.activity_id
  LEFT JOIN locations ON activity_locations.location_id = locations.id
  JOIN activity_category ON activities.id = activity_category.activity_id
  JOIN category ON activity_category.category_id = category.id
  LEFT JOIN activity_detail_urls ON activities.id = activity_detail_urls.activity_id
  LEFT JOIN detail_urls ON activity_detail_urls.detail_url_id = detail_urls.id
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


//---GET ACTIVITIES BY CATEGORY----------------------------------------------------------------------------------------------------------------
//Only get a users activities that have a same category_name
activityController.getActivitiesByCategory = (req, res, next) => {
  
  const username = req.body.username
  const category_name = req.body.category_name

  // Decided against using query params as there are some characters you wouldn't want to have show up in the url
  // const username = req.query.username;
  // const category_name = req.query.category_name;

  console.log(username, category_name)

  const queryString = 
  `SELECT activity_name, completed, activities.id as activity_id, location_name, category_name, url FROM activities
  JOIN users_activities ON activities.id = users_activities.activity_id
  JOIN user_info ON users_activities.user_info_id = user_info.id
  LEFT JOIN activity_locations ON activities.id = activity_locations.activity_id
  LEFT JOIN locations ON activity_locations.location_id = locations.id
  JOIN activity_category ON activities.id = activity_category.activity_id
  JOIN category ON activity_category.category_id = category.id
  LEFT JOIN activity_detail_urls ON activities.id = activity_detail_urls.activity_id
  LEFT JOIN detail_urls ON activity_detail_urls.detail_url_id = detail_urls.id
  WHERE username = $1 and category_name = $2`

  db.query(queryString, [username, category_name])
  .then(data => {
    console.log('data.rows in activityController.getActivities', data.rows);
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
    
    res.locals.afterGet = activityArray;
    console.log('activityArray', activityArray)
    console.log('res.locals.afterGet', res.locals.afterGet);
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

//---POST ACTIVITY--------------------------------------------------------------------------------------------------------------------------
activityController.postActivity = async (req, res, next) => {
  const { username, activity_name, category_name, location_name, urls } = req.body;
  let user_id
  
  try {
    // Retrieve a user_id for a specific username
    const queryString0 = `SELECT id FROM user_info
                          WHERE username = $1;`

    const userData = await db.query(queryString0, [username]);

    user_id = userData.rows[0].id;
    console.log('user_id', user_id);

    //-----------------------------------------------------------------------------------------------------------------------------------
    //Given a user_id and an activity_name, add said activity_name to activities table and add both Id's to users_activities join table

    /* for an activity: 
      isUnique: true
      primaryId: user_id 
      secondaryValue: activity_name (e.g. value is climb half dome)
      secondaryValueCol: 'activity_name'
      secondaryTable: 'activities'
      joinTable: 'users_activities'
      primaryJoinCol: user_id 
      secondaryJoinCol: activity_id
    */
    
    const [activityJoinData, activity_id ] = await checkInsertAndJoin(true, user_id, activity_name, 'activity_name', 'activities', 'users_activities', 'user_info_id', 'activity_id', next);
    
    res.locals.result = { activityJoinData: activityJoinData };


    //-----------------------------------------------------------------------------------------------------------------------------------
    //Given an activity_id and a category_name, add said category_name to category table and add both Id's to activity_category join table

    /* for a category: 
      isUnique: false
      primaryId: activity_id 
      secondaryValue: category_name (e.g. value is 'travel')
      secondaryValueCol: 'category_name'
      secondaryTable: 'category'
      joinTable: 'activity_category'
      primaryJoinCol: 'activity_id'
      secondaryJoinCol: 'category_id'
    */

    const [categoryJoinData] = await checkInsertAndJoin(false, activity_id, category_name, 'category_name', 'category', 'activity_category', 'activity_id', 'category_id', next);

    res.locals.result.categoryJoinData = categoryJoinData;


    //-----------------------------------------------------------------------------------------------------------------------------------
    //Given a activity_id and a location_name, add said location_name to locations table and add both Id's to activity_locations join table

    /* for a location: 
      isUnique: false
      primaryId: activity_id 
      secondaryValue: new mexico
      secondaryValueCol: location_name
      secondaryTable: locations
      joinTable: activity_locations
      primaryJoinCol: activity_id 
      secondaryJoinCol: location_id
    */
    if (location_name !== undefined) {
      const [locationJoinData] = await checkInsertAndJoin(false, activity_id, location_name, 'location_name', 'locations', 'activity_locations', 'activity_id', 'location_id', next);
      res.locals.result.locationJoinData = locationJoinData;
    }

    //------------------------------------------------------------------------------------------------------------------------------------------------
    //Given a activity_id and a urls array, add each url from the urls Array to detail_urls table and add both Id's to activity_detail_urls join table

    if (urls !== undefined) {
      const urlJoinData = await urlQueryBuilder(urls, activity_id, next);
      res.locals.result.urlJoinData = urlJoinData;
    }
    
    // console.log('res.locals from postActivity new', res.locals)
    return next()

  } catch (err) {
    return next({
      log: `activityController.postActivity middleware error: ${err.message}`,
      status: 501,
      message: 'Failed to execute query to POST all activities',
    });
  }
}



//---UPDATE ACTIVITY--------------------------------------------------------------------------------------------------------------------------

activityController.updateActivity = (req, res, next) => {
  const { completed, activity_id } = req.body;
  
  const queryString = `UPDATE activities SET completed = $1 WHERE id = $2 RETURNING *`
 db.query(queryString, [!completed, activity_id])
  .then(data => {
    console.log('data.rows in activityController.updateActivity', data.rows);
    res.locals.afterDelete = data.rows
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


module.exports = activityController;



//---Helper functions----------------------------------------------------------------------------------------------------------------------------

/**
 * 
 * @param {boolean} isUninque: whether or not the item being added is a unique item (e.g. true for activity as each one has a true or false unique to each activity/user) 
 * @param {string | number} primaryId: id you already have (e.g. activity_id)  
 * @param {*} secondaryValue: value you want to add (e.g. categoryName)
 * @param {string} secondaryValueCol: column in secondary table that secondaryValue goes in (e.g. category_name)
 * @param {string} secondaryTable: table the secondaryValue should go in (e.g. category)
 * @param {string} joinTable: join table both id's need to go in (e.g. activity_category) 
 * @param {string} primaryJoinCol: name of column associated with primaryId in join table (e.g activity_id)
 * @param {string} secondaryJoinCol: name of column associated with secondaryId in join table (e.g category_id)
 * @param {function} next: next from parent controller 
 * @returns 
 */

async function checkInsertAndJoin(isUninque, primaryId, secondaryValue, secondaryValueCol, secondaryTable, joinTable, primaryJoinCol, secondaryJoinCol, next) {
  // First, if it's not unique, do a get request to see if the activity already
  let secondaryId;
  try {
    if (!isUninque) {
      const queryCheckIfAlreadyExists = `SELECT id FROM ${secondaryTable}
                                         WHERE ${secondaryValueCol} = $1`;
      
      const existData = await db.query(queryCheckIfAlreadyExists, [secondaryValue]);
      console.log('existData', existData.rows);
      if (existData.rows[0] !== undefined) {
        secondaryId = existData.rows[0].id
        // console.log('secondaryId already existed:', secondaryId)
      }
    }

    // If you didn't find a secondaryId, make an isert and grab the id after as the secondary id
    if (secondaryId === undefined) {
      const queryInsertNewValue = `INSERT INTO  ${secondaryTable} (${secondaryValueCol}) VALUES ($1)
                                   RETURNING id;`

      const insertData = await db.query(queryInsertNewValue, [secondaryValue])

      secondaryId = insertData.rows[0].id
      // console.log('secondaryId from insert:', secondaryId);
    }

    // At this point you'll have a secondary id, make the insert into the join table
    const queryInsertJoinTable = `INSERT INTO ${joinTable} (${primaryJoinCol}, ${secondaryJoinCol}) VALUES ($1, $2) 
                                  RETURNING *`

    const joinData = await db.query(queryInsertJoinTable, [primaryId, secondaryId])

    // console.log('returning from data from join table', joinData.rows)
    return [joinData.rows, secondaryId];
    
  } catch (err) {
    console.log('err')
    return next({
      log: `activityController.postActivity middleware error.
       Tried to add ${secondaryValue} to ${secondaryTable}'s ${secondaryValueCol} column and ${joinTable}.
       Error message: ${err.message}`,
      status: 501,
      message: 'Failed to execute query to POST all activities',
    });
  }
}

async function urlQueryBuilder(urlArray, activity_id, next) {
  const urlResults = [];
  for (const url of urlArray) {

    /* for a url: 
      isUnique: false
      primaryId: activity_id 
      secondaryValue: url (e.g. value is 'cool.com')
      secondaryValueCol: 'url'
      secondaryTable: 'detail_urls'
      joinTable: 'activity_detail_urls'
      primaryJoinCol: 'activity_id'
      secondaryJoinCol: 'detail_url_id'
    */
    
    const [urlJoinData] = await checkInsertAndJoin(false, activity_id, url, 'url', 'detail_urls', 'activity_detail_urls', 'activity_id', 'detail_url_id', next);
    urlResults.push(urlJoinData)
  }
  
  return urlResults;
}


/* Old controllers

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
  
*/