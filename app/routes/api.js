// ****************************************************************************
// *                              Backend Routes                              *
// ****************************************************************************
var User    = require('../models/user')
var jwt     = require('jsonwebtoken');
var secret  = 'sabaton';

module.exports = function(router){
	// http://localhost:8080/api/users
	// USER REGISTRATION ROUTE
	router.post('/users', function(req, res){
		var user = new User();
		user.username = req.body.username;
		user.password = req.body.password;
		user.email    = req.body.email;
		user.name     = req.body.name;

		if(req.body.username == null || req.body.username == '' || req.body.password == null || req.body.password == '' || req.body.email == null || req.body.email == '' || req.body.name == null || req.body.name == ''){
			res.json({success: false, message: 'Ensure username, email, name and password are provided'});
		} else {
			user.save(function(err){
				if(err){
					// Handles all validation errors
					if(err.errors != null){ 
						if(err.errors.name){
							res.json({success: false, message: err.errors.name.message});
						} else if(err.errors.email){
							res.json({success: false, message: err.errors.email.message});
						} else if(err.errors.username){
							res.json({success: false, message: err.errors.username.message});
						} else if(err.errors.password){
							res.json({success: false, message: err.errors.password.message});
						} else {
							res.json({success: false, message: err});
						}
					} else if(err){
						// Duplicate username or email
						if(err.code = 11000){
							// Dup username
							if(err.errmsg[56] == 'u'){
								res.json({success: false, message: 'Username already exists'});
							} else if(err.errmsg[55] == 'e'){
								res.json({success: false, message: 'Email already exists'});
							} else {
								res.json({success: false, message: err.errmsg + ' You should not see this. Check the indexing with table name'});
							}		
						} else {
							res.json({success: false, message: err});
						}
					} 
				} else {
					// Success
					res.json({success: true, message: 'User created. Nice!'});
				}
			});
		}
	});

	// USER LOGIN ROUTE
	// Provides JSON webtoken
	// http://localhost:8080/api/authenticate
	router.post('/authenticate', function(req, res){
		// Grab user from DB
		User.findOne({ username: req.body.username })
		.select('email username password')
		.exec(function(err, user){
			//DB error check
			if(err) throw err;
			//auth -> compare to DB and see if they exit
			if(!user){
				res.json({ success: false, message: 'Could not authenticate user. Make sure you typed your name in correctly' });
			} else {
				// password present?
				if(req.body.password){
					var validPassword = user.comparePasswords(req.body.password);
				} else {
					res.json({success: false, message: 'No password provided'});
				}
				// password valid?
				if(!validPassword){
					res.json({success: false, message: 'Incorrect password' });
				} else {
					// Password is valid, create the web token and send everything back
					var token = jwt.sign({
						username: user.username, 
						email: user.email 
					}, secret, {expiresIn: '24h'});
					res.json({success: true, message: 'User logged in successfully', token: token });
				}
			}

		});

	});


	// GET CURRENT USER
	// https://localhost:8080/api/me

	// Middleware for getting and 
	router.use(function(req, res, next) {
		var token = req.body.token || req.body.query || req.headers['x-access-token'];
		if(token){
			jwt.verify(token, secret, function(err, decoded){
				if(err) {
					res.json({success: false, message: 'Token invalid'});
				} else {
					req.decoded = decoded;
					next();
				}

			})
		} else {
			res.json({success: false, message: 'No token provided'});
		}
	});

	// Current user route
	router.post('/me', function(req, res){
		res.send(req.decoded);
	});

	return router;
}
