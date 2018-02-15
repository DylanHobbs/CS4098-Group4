// ****************************************************************************
// *                              Backend Routes                              *
// ****************************************************************************
var User    = require('../models/user');
var Event   = require('../models/event');
var jwt     = require('jsonwebtoken');
var secret  = process.env.SECRET || 'sabaton';
var mail_key = process.env.API_KEY
var nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');

module.exports = function(router){

	// SEND MAIL OPTIONS
	var options = {
	  auth: {
	    api_user: 'MrUnderscore',
	    api_key: mail_key
	  }
	}

	var client = nodemailer.createTransport(sgTransport(options));

	/*
 #     #  #####  ####### ######     ######  ####### #     # ####### #######  #####
 #     # #     # #       #     #    #     # #     # #     #    #    #       #     #
 #     # #       #       #     #    #     # #     # #     #    #    #       #
 #     #  #####  #####   ######     ######  #     # #     #    #    #####    #####
 #     #       # #       #   #      #   #   #     # #     #    #    #             #
 #     # #     # #       #    #     #    #  #     # #     #    #    #       #     #
  #####   #####  ####### #     #    #     # #######  #####     #    #######  #####

*/
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
		.select('email username name password active')
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
					console.log(user.name);
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
					res.json({success: false, message: err});
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
				if(!req.body.password){
					res.json({success: false, message: 'No password provided'});
				} else {
					var validPassword = user.comparePasswords(req.body.password);
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


	// Changeing password
	router.post('/changePassword', function(req, res){
		// Grab user from DB
		User.findOne({ username: req.body.username })
		.select('username password active')
		.exec(function(err, user){
			//DB error check
			if(err) throw err;
			//auth -> compare to DB and see if they exit
			if(!user){
				res.json({ success: false, message: 'Change Password Error: No user found', user: req.body });
			} else {
				// password present?
				if(req.body.oldPassword){
					var validPassword = user.comparePasswords(req.body.oldPassword);
				} else {
					res.json({success: false, message: 'No old password provided'});
				}
				// password valid?
				if(!validPassword){
					res.json({success: false, message: 'Incorrect old password' });
				} else if(!user.active){
					// aaccount is not activated
					res.json({success: false, linkFail: true, message: 'Account is not activated' });
				} else {
					// Password is valid
					if(!req.body.newPassword){
						res.json({ success: false, message: 'No new password provided' });
					} else {
						// Set the new password
						user.password = req.body.newPassword;
						user.save(function(err){
							if(err) {
								throw err
							} else {
								res.json({ success: true, message: 'Password has been changed' });
							}
						});
					}
				}
			}
		});
	});

// router.post('/', 
// function(req, res, next) 
// {Geoloc.findOneAndUpdate(
// 	{id: req.body.id}, req.body, {runValidators: true, upsert: true, context: 'query'}, function(err, post) {
// 	// if (err) return next(err);
// 	if (err) console.log(err);
// 	res.status(201).json(post);
// 	});
// });

	router.post('/changeUsername', function(req, res){
		// Grab user from DB
		var newName = req.body.newUsername;
		if(!newName){
			res.json({ success: false, message: 'No new username provided' });
		}
		User.findOneAndUpdate({username: req.body.username}, {username: newName}, {runValidators: true, upsert: true, context: 'query'})
		.select('username password active')
		.exec(function(err, user){
			//DB error check
			if(err) throw err;
			//auth -> compare to DB and see if they exit
			if(!user){
				res.json({ success: false, message: 'Change Username Error: No user found', user: req.body });
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
					// account is not activated
					res.json({success: false, linkFail: true, message: 'Account is not activated' });
				} else {
					// Password is valid
					if(!req.body.newUsername){
						res.json({ success: false, message: 'No new username provided' });
					} else {
						// Set the new password
						user.username = req.body.newUsername;
						user.save(function(err){
							if(err) {
								console.log(err);
								res.json({ success: false, message: 'DB ERROR' });
							} else {
								res.json({ success: true, message: 'Username has been changed', name: user.username });
							}
						});
					}
				}
			}
		});
	});

	// Route to send user's username to e-mail
	router.get('/resetusername/:email', function(req, res) {
		User.findOne({ email: req.params.email }).select('email name username').exec(function(err, user) {
			if (err) {
				res.json({ success: false, message: err }); // Error if cannot connect
			} else {
				if (!user) {
					res.json({ success: false, message: 'E-mail was not found' }); // Return error if e-mail cannot be found in database
				} else {
					// If e-mail found in database, create e-mail object
					var email = {
						from: 'Staff, staff@localhost.com',
						to: user.email,
						subject: 'Username Request',
						text: 'Hello ' + user.name + '! Yes, you, ' + user.username + '! I heard that <strong>' + user.username + '</strong> could use a reminding on what ' + user.username + '\'s username is. Well ' + user.username + ', let me spell it out for you:' + user.username + '.',
						html: 'Hello <strong>' + user.name + '</strong>!<br><br> Yes, you, <strong>' + user.username + '</strong>! I heard that <strong>' + user.username + '</strong> could use a reminding on what <strong>' + user.username + '\'s</strong> username is. Well <strong>' + user.username + '</strong>, let me spell it out for you:<br> <strong>' + user.username + '</strong>.' 
					};

					// Function to send e-mail to user
					client.sendMail(email, function(err, info) {
						if (err) console.log(err); // If error in sending e-mail, log to console/terminal
					});
					res.json({ success: true, message: 'Username has been sent to e-mail! ' }); // Return success message once e-mail has been sent
				}
			}
		});
	});
			

	// GET CURRENT USER
	// https://localhost:8080/api/me
	// Middleware for Routes that checks for token - Place all routes after this route that require the user to already be logged in
	router.use(function(req, res, next) {
		var token = req.body.token || req.body.query || req.headers['x-access-token']; // Check for token in body, URL, or headers

		// Check if token is valid and not expired	
		if (token) {
			// Function to verify token
			jwt.verify(token, secret, function(err, decoded) {
				if (err) {
					res.json({ success: false, message: 'Token invalid' }); // Token has expired or is invalid
				} else {
					req.decoded = decoded; // Assign to req. variable to be able to use it in next() route ('/me' route)
					next(); // Required to leave middleware
				}
			});
		} else {
			res.json({ success: false, message: 'No token provided' }); // Return error if no token was provided in the request
		}
	});

	// // Route to get the currently logged in user	
	// router.post('/me', function(req, res) {
	// 	res.send(req.decoded); // Return the token acquired from middleware
	// });

	// This is here because usernames for the app are got from the token
	// If a user changes their username the one in the token will be wrong
	// Grabing up to date info from DB. Above method will work if their token is 
	// Changed on update. TODO:!!
	router.post('/me', function(req, res) {
		User.findOne({ email: req.decoded.email }).select('email name username').exec(function(err, user) {
			if (err) {
				res.json({ success: false, message: err }); // Error if cannot connect
			} else {
				if (!user) {
					res.json({ success: false, message: 'E-mail was not found' }); // Return error if e-mail cannot be found in database
				} else {
					res.send(user);
				}
			}
		});
	});

	// Gets user permissions to see if they can be on a page
	router.get('/permission', function(req, res){
		User.findOne({ email: req.decoded.email }, function(err, user){
			if(err) throw err
			if(!user){
				res.json({ success: false, message: 'User was not found' });
			} else {
				res.json({ success: true, permission: user.permission });
			}
		});
	});

	// Used to populate data tables
	router.get('/management', function(req, res){
		User.find({}, function(err, users){
			if(err) throw err;
			//Check if they're allowed use this route
			User.findOne({ username: req.decoded.username }, function(err, mainUser){
				if(err) throw err;
				if(!mainUser){
					res.json({ success: false, message: 'User was not found' });
				} else {
					if(mainUser.permission === 'admin'){
						// Exitst and has permission
						if(!users){
							res.json({ success: false, message: 'User[s] not found' });
						} else {
							res.json({ success: true, users: users, permission: mainUser.permission });
						}
					} else {
						res.json({ success: false, message: 'You don\'t have the correct permissions to access this' });
					}
				}
			});
 		});
	});

	router.delete('/management/:username', function(req, res){
		var deletedUser = req.params.username;
		User.findOne({ username: req.decoded.username }, function(err, mainUser){
			if(err) throw err;
			if(!mainUser){
				res.json({ success: false, message: 'User was not found' });
			} else {
				if(mainUser.permission === 'admin'){
					// Exitst and has permission
					if(!deletedUser){
						res.json({ success: false, message: 'No username provided' });
					} else {
						User.findOneAndRemove({username: deletedUser}, function(err, user){
							if(err) throw err;
							res.json({ success: true, message: 'User deleted' });
						});
					}
				} else {
					res.json({ success: false, message: 'You don\'t have the correct permissions to access this' });
				}
			}
		});
	});

	router.get('/edit/:id', function(req, res){
		var editUser = req.params.id;
		User.findOne({ username: req.decoded.username }, function(err, mainUser){
			if(err) throw err;
			if(!mainUser){
				res.json({ success: false, message: 'User was not found' });
			} else {
				if(mainUser.permission === 'admin'){
					User.findOne({_id: editUser}, function(err, user){
						if(err) throw err;
						if(!user){
							res.json({ success: false, message: 'User to edit was not found' });
						} else {
							res.json({ success: true, user: user});
						}
					});
				} else {
					res.json({ success: false, message: 'You don\'t have the correct permissions to access this' });
				}
			}
		});
	});

	// Used for all kinds of edits
	router.put('/edit', function(req, res){
		var editUser = req.body._id;
		if(!editUser){
			res.json({ success: false, message: 'No username provided' });
		}
		if(req.body.name) 		var newName 		= req.body.name;
		if(req.body.username) 	var newUsername 	= req.body.username;
		if(req.body.email)		var newEmail 		= req.body.email;
		if(req.body.permission) var newPermission 	= req.body.permission;
		
		// Check if current user has access to this
		User.findOne({ username: req.decoded.username }, function(err, mainUser){
			if(err) throw err;
			if(!mainUser){
				res.json({ success: false, message: 'User was not found' });
			} else {
				if(mainUser.permission === 'admin'){
					// NAME CHANGE
					if(newName){
						User.findOne({_id: editUser}, function(err, user){
							if(err) throw err;
							if(!user){
								res.json({ success: false, message: 'No user by this name was found' });
							} else {
								user.name = newName;
								user.save(function(err){
									if(err){
										console.log(err);
									} else {
										res.json({ success: true, message: 'Name has been changed' });
									}	
								});
							}
						});
					}
					// USERNAME CHANGE
					if(newUsername){
						User.findOne({_id: editUser}, function(err, user){
							if(err) throw err;
							if(!user){
								res.json({ success: false, message: 'No user by this name was found' });
							} else {
								user.username = newUsername;
								user.save(function(err){
									if(err){
										console.log(err);
									} else {
										res.json({ success: true, message: 'Username has been changed' });
									}	
								});
							}
						});
					}

					// EMAIL CHANGE
					if(newEmail){
						User.findOne({_id: editUser}, function(err, user){
							if(err) throw err;
							if(!user){
								res.json({ success: false, message: 'No user by this name was found' });
							} else {
								user.email = newEmail;
								user.save(function(err){
									if(err){
										console.log(err);
									} else {
										res.json({ success: true, message: 'Email has been changed' });
									}	
								});
							}
						});
					}

					if(newPermission){
						User.findOne({_id: editUser}, function(err, user){
							if(err) throw err;
							if(!user){
								res.json({ success: false, message: 'No user by this name was found' });
							} else {
								// see line 944
								if(newPermission === 'user' || newPermission === 'host' || newPermission === 'admin'){
									user.permission = newPermission;
									user.save(function(err){
										if(err){
											console.log(err);
										} else {
											res.json({ success: true, message: 'Permissions have been changed' });
										}	
									});
								} else {
									res.json({ success: false, message: 'Not a valid permission to change to' });
								}
							}
						});
					}
				} else {
					res.json({ success: false, message: 'You don\'t have the correct permissions to access this' });
				}
			}
		});
	});

	/*
 ####### #     # ####### #     # #######    ######  ####### #     # ####### #######  #####
 #       #     # #       ##    #    #       #     # #     # #     #    #    #       #     #
 #       #     # #       # #   #    #       #     # #     # #     #    #    #       #
 #####   #     # #####   #  #  #    #       ######  #     # #     #    #    #####    #####
 #        #   #  #       #   # #    #       #   #   #     # #     #    #    #             #
 #         # #   #       #    ##    #       #    #  #     # #     #    #    #       #     #
 #######    #    ####### #     #    #       #     # #######  #####     #    #######  #####

*/

router.post('/users', function(req, res){
	var event = new Event();
	event.name = req.body.name;
	event.eventId = req.body.eventId;
	event.time = req.body.time;
	event.venue = req.body.vanue;

	if(req.body.name == null || req.body.name == '' || req.body.eventId == null || req.body.eventId == '' || req.body.time == null || req.body.time == '' || req.body.venue == null || req.body.venue == ''){
		res.json({success: false, message: 'Ensure event name, eventID, time and venue are provided'});
	} else {
		event.save(function(err){
			if(err) throw err;
			res.json({success: true, message: 'Event Created'});
		});
	}
});

	
	return router; // Return the router object to server
}
