const db = require('../models/vaultModel.js');
const bcrypt = require('bcryptjs');

const userController = {};

const saltRound = 10


//Signup controllers

userController.checkUsername = (req, res, next) => {
  // console.log('req.body', JSON.stringify(req.body));
	const { username, password, first_name } = req.body;
  // console.log('signup vars',username, password, first_name)
	res.locals.user = {}
	
	const queryString = `SELECT * FROM user_info
	WHERE username = $1`;

	db.query(queryString, [username])
		.then((data) => {
			if (data.rows[0] !== undefined) {
				res.locals.user.status = 'UsernameExists';
				return next();
			} else {
        // console.log('Username does not already exist');
        res.locals.newUser = { username, password, first_name };
        res.locals.user.status = 'valid';
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

userController.userSignup = async (req, res, next) => {
	if (res.locals.user.status !== 'valid') {
		return next();
	 }
  const { newUser } = res.locals;

  // console.log('newUser.username', newUser.username, typeof newUser.username)
  // console.log('newUser.password', newUser.password, typeof newUser.password)
  // console.log('newUser.first_name', newUser.first_name, typeof newUser.first_name)

	const hashedPw = await bcrypt.hash(newUser.password, saltRound)
	// console.log('hashedPw', hashedPw, typeof hashedPw)
  const queryString = `INSERT INTO user_info (username, password, first_name) 
											VALUES ( $1, $2, $3)
											RETURNING *`

 db.query(queryString, [newUser.username, hashedPw, newUser.first_name])
  .then(data => {
    // console.log('data.rows in userController.userSignup', data.rows);
		res.locals.user.username = data.rows[0].username;
		res.locals.user.firstName = data.rows[0].first_name;
		// console.log(res.locals.user)
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

//Login controllers

userController.userVarification = (req, res, next) => {
	const { username, password } = req.body;
	const queryString = `SELECT * FROM user_info WHERE username = $1`;
	res.locals.user = {}
 db.query(queryString, [username])
  .then(data => {
		// console.log('data.rows in userController.userVarification', data.rows);
		//if user is not in the database
			if (data.rows[0] === undefined) {
				res.locals.user.status = "UserNotFound";
				return next();
			}

			const pwInDb = data.rows[0].password;
			//if pw user provided is not matching to pw in DB
			if (!bcrypt.compareSync(password, pwInDb)) {
				res.locals.user.status = 'IncorrectPassword'
				return next()
			}
		
			res.locals.user.username = data.rows[0].username;
			res.locals.user.firstName = data.rows[0].first_name;
			res.locals.user.status = 'valid';
			// console.log(res.locals.user)
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

module.exports = userController;