//import bcrypt from 'bcrypt'
const db = require('../models/vaultModel.js');

const userController = {};

const saltRound = 10

//Add controllers here!

//login controller
userController.userVarification = (req, res, next) => {
	const { username, password } = req.body;
	const queryString = ``
 db.query(queryString, [username, password])
  .then(data => {
    console.log('data.rows in userController.userVarification', data.rows);
    res.locals.afterPost = data.rows
    return next(); 
  })
  .catch((err) => {
		return next({
			log: `userController.userVarification middleware error: ${err.message}`,
			status: 501,
			message:'Failed to execute query to POST all activities',
		});
	});
}

//signup controller
userController.userSignup = (req, res, next) => {
	const { username, password, first_name } = req.body;
	//const hashedPw = bcrypt.hash(password, saltRound)
  const queryString = `INSERT INTO user_info (username, password, first_name) 
											VALUES ( $1, $2, $3)
											RETURNING *`

 db.query(queryString, [username, hashedPw, first_name])
  .then(data => {
    console.log('data.rows in userController.userSignup', data);
    res.locals.afterPost = data
    return next(); 
  })
  .catch((err) => {
		return next({
			log: `userController.userSignup middleware error: ${err.message}`,
			status: 501,
			message:'Failed to execute query to POST all activities',
		});
	});
}

/* Works with old database as a sample
// CHECK USERNAME IN DATABASE --------------------------------------------------------------------------------------------------------------------------------------
userController.checkUsername = (req, res, next) => {
	const { username, password } = req.body;
	const values = [username];
	const queryString = `SELECT * FROM "public"."user"
	WHERE username = $1`;

	db.query(queryString, values)
    .then((data) => {
      console.log('in DB query')
			if (data.rows[0] !== undefined) {
				res.locals.status = 'UserNameExists';
				return next();
			} else {
        // console.log('Username does not already exist');
        res.locals.newUser = { username, password };
        res.locals.status = 'valid';
        return next();
      }
		})
		.catch((err) => {
			const errorObj = {
				log: `userController.createUser middleware error ${err.message}`,
				status: 501,
				message: 'Login failed',
			};
			return next(errorObj);
		});
};
*/

module.exports = userController;