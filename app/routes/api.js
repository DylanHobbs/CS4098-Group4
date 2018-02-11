// ****************************************************************************
// *                              Backend Routes                              *
// ****************************************************************************
var User    = require('../models/user')
var jwt     = require('jsonwebtoken');
var secret  = process.env.SECRET || 'sabaton';
var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');

module.exports = function(router){

	// SEND MAIL OPTIONS
	var options = {
	  auth: {
	    api_user: 'MrUnderscore',
	    api_key: 'password1'
	  }
	}

	var client = nodemailer.createTransport(sgTransport(options));


	// http://localhost:8080/api/users
	// USER REGISTRATION ROUTE
	router.post('/users', function(req, res){
		var user = new User();
		user.username = req.body.username;
		user.password = req.body.password;
		user.email    = req.body.email;
		user.name     = req.body.name;
		// Used for email validation
		user.tmpToken = jwt.sign({username: user.username, email: user.email, name: user.name }, secret, {expiresIn: '24h'});

		if(req.body.username == null || req.body.username == '' || req.body.password == null || req.body.password == '' || req.body.email == null || req.body.email == '' || req.body.name == null || req.body.name == ''){
			res.json({success: false, message: 'Ensure username, email, name and password are provided'});
		} else {
			user.save(function(err){
				if(err){
					console.log(err);
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
							if(err.errmsg[57] == 'u'){
								res.json({success: false, message: 'Username already exists'});
							} else if(err.errmsg[57] == 'e'){
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
					// Send email
					var email = {
						from: 'Staff, staff@localhost.com',
						to: user.email,
						subject: 'Activation Link',
						text: 'Hello ' + user.name + '! Thank you for registering. Please click on the link to below to complete activation of your account. http://localhost:8080/activate/' + user.tmpToken,
						html: 'Hello <strong>' + user.name + '</strong>!<br><br>Thank you for registering. Please click on the link to below to complete activation of your account.<br><br> <a href="http://localhost:8080/activate/' + user.tmpToken + '">http://localhost:8080/activate/</a>'
					};

					client.sendMail(email, function(err, info){
						if (err){
						  console.log(err);
						}
						else {
						  console.log('Message sent: ' + info.response);
						}
					});

					// Send response
					res.json({success: true, message: 'Account Registered! Please check email for activation link'});
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
		.select('email username password active')
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
				} else if(!user.active){
					// check if they've validated email
					res.json({success: false, linkFail: true, message: 'Account is not yet activated. Check your email' });
				} else {
					// Password is valid, create the web token and send everything back
					var token = jwt.sign({
						username: user.username, 
						email: user.email,
						name: user.name 
					}, secret, {expiresIn: '24h'});
					res.json({success: true, message: 'User logged in successfully', token: token });
				}
			}

		});

	});

	// Activate route
	router.put('/activate/:token', function(req, res){
		// Search DB for user
		User.findOne({ tmpToken: req.params.token }, function(err, user){
			if(err) throw err
			var token = req.params.token;
			jwt.verify(token, secret, function(err, decoded){
				if(err) {
					res.json({success: false, message: 'Activation has expired'});
				} else if(!user){
					res.json({success: false, message: 'Activation has expired'});
				} else {
					// All good
					user.tmpToken = false;
					user.active = true;
					user.save(function(err){
						if(err){
							// Failed to commit user
							console.log(err);
						} else {
							// All good
							// Send them an emailing saying they've registered
							var email = {
								from: 'Staff, staff@localhost.com',
								to: user.email,
								subject: 'Account Activated',
								text: 'Hello ' + user.name + '! Thank you for activating your account. You can now log in!',
								html: 'Hello <strong>' + user.name + '</strong>!<br><br>Thank you for activating your account. You can now log in!'
							};

							client.sendMail(email, function(err, info){
								if (err){
								  console.log(err);
								}
								else {
								  console.log('Message sent: ' + info.response);
								}
							});
							res.json({success: true, message: 'Account activated!'});
						}
					});
				}

			});
		});
	});

	// Checking credentials for resending of activation link
	router.post('/resend', function(req, res){
		// Grab user from DB
		User.findOne({ username: req.body.username })
		.select('username password active')
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
				} else if(user.active){
					// account is already activated
					res.json({success: false, linkFail: true, message: 'Account is already activated' });
				} else {
					// Password is valid, create the web token and send everything back
					res.json({ success: true, user: user });
				}
			}
		});
	});

	// Actually do the sending
	router.put('/resend', function(req, res){
		User.findOne({ username: req.body.username })
		.select('username name email tmpToken')
		.exec(function(err, user){
			if(err) throw err;
			user.tmpToken = jwt.sign({username: user.username, email: user.email, name: user.name }, secret, {expiresIn: '24h'});
			user.save(function(err){
				if(err){
					console.log(err);
				} else {
					var email = {
						from: 'Staff, staff@localhost.com',
						to: user.email,
						subject: 'Activation Link Resend Request',
						text: 'Hello ' + user.name + '! You\'ve requested a resending of an activation link. Please click on the link to below to complete activation of your account. http://localhost:8080/activate/' + user.tmpToken,
						html: 'Hello <strong>' + user.name + '</strong>!<br><br>You\'ve requested a resending of an activation link. Please click on the link to below to complete activation of your account.<br><br> <a href="http://localhost:8080/activate/' + user.tmpToken + '">http://localhost:8080/activate/</a>'
					};

					client.sendMail(email, function(err, info){
						if (err){
						  console.log(err);
						}
						else {
						  console.log('Message sent: ' + info.response);
						}
					});
					res.json({ success: true, message: 'Activation link sent to ' + user.email })
				}
			});
		});
	});


	// GET CURRENT USER
	// https://localhost:8080/api/me

	// Middleware for getting an user
	router.use(function(req, res, next) {
		var token = req.body.token || req.body.query || req.headers['x-access-token'];
		if(token){
			jwt.verify(token, secret, function(err, decoded){
				if(err) {
					// Token has expired or been invalidated
					res.json({success: false, message: 'Token invalid'});
					next();
				} else {
					req.decoded = decoded;
					next();
				}

			});
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
