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
var qrImage = require('../../public/assets/js/qr.js')

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

	router.post('/authReg', function(req, res){
		var user = new User();
		user.username = req.body.username;
		user.password = req.body.password;
		user.email    = req.body.email;
		user.name     = req.body.name;
		// Used for email validation
		user.active = true;
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
					/*var email = {
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
					});*/

					// Send response
					res.json({success: true, message: 'Account Registered!'});
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
						// Exists and has permission
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
					// Exists and has permission
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

	router.post('/createEvent', function(req, res){
		var event = new Event();
		event.name = req.body.name;
		event.eventId = req.body.id;
		//event.time = req.body.time;
		event.venue = req.body.venue;
		event.date = req.body.date;
		event.tables = req.body.tables;
		event.seatsPer = req.body.seats;
		event.description = req.body.description;
		if(req.body.menu){
			event.menu = req.body.menu;
		}
		console.log(req.body);

		if(req.body.description == null || req.body.description == '' || req.body.name == null || req.body.name == '' || req.body.id == null || req.body.id == '' || req.body.tables == null || req.body.tables == '' || req.body.venue == null || req.body.venue == '' || req.body.seats == null || req.body.seats == '' || req.body.date == null || req.body.date == ''){
			res.json({success: false, message: 'Ensure all input fields are filled in'});
		} else {
			event.save(function(err){
				if(err) throw err;
				res.json({success: true, message: 'Event Created'});
			});
		}
	});

	router.get('/events', function(req, res){
		Event.find({}, function(err, events){
			
			if(err) throw err;
			//Check if they're allowed use this route
			User.findOne({ username: req.decoded.username }, function(err, mainUser){
				if(err) throw err;
				if(!mainUser){
					res.json({ success: false, message: 'User was not found' });
				} else {
				//	if(mainUser.permission === 'admin'){
						// Exitst and has permission
						if(!events){
							res.json({ success: false, message: 'Events[s] not found' });
						} else {
							res.json({ success: true, events: events, permission: mainUser.permission });
						}
					} 
					//else {
				//		res.json({ success: false, message: 'You don\'t have the correct permissions to access this' });
				//	}
				//}
			});
 		});
	});

	router.get('/viewEvent/:id', function(req, res){
		
		var eventID = req.params.id;
		
		Event.findOne({ eventId: eventID }, function(err, event){
			
			if(err) throw err;

			if(!event){
				res.json({ success: false, message: 'Event was not found' });
			} else {
				
					var invited = event.invited; 
					var invitedUsers = [];
					var rsvp = event.rsvp;
					var rsvpUsers= []
		
					// if invited is already a list why iterate through it ????
					invited.forEach(function(element){

						User.findOne({email: element}, function(err, user){
							if(err) throw err;
							invitedUsers.push(user);
						});
					} )
					rsvp.forEach(function(element){

						User.findOne({email: element}, function(err, user){

							if(err) throw err;
							rsvpUsers.push(user);
						});
					} )
					// need to make a callback function for this
					setTimeout(function() {
						res.json({ success: true, event: event, invitedUsers: invitedUsers,rsvpUsers: rsvpUsers, message: 'heres a message'});

						}, 100);
					// res.json({ success: true, invitedUsers: invitedUsers, message: 'heres a message'});

			}
		});
	});

	// trying to remove user from rsvp/guest list

	router.delete('/viewEvent/:id/:email', function(req, res){
		var eventID = req.params.id;
		var email = req.params.email;

		Event.findOne({ eventId: eventID }, function(err, event){

			var invite = event.invited; 
			var invitedUsers = [];
			var rsvpd = event.rsvp;
			var rsvpUsers= []
			// console.log(event.invited)
			
			if(err) throw err;

			if(!event){
				console.log("no event")
				res.json({ success: false, message: 'Event was not found' });
			} else {
				if(email){

					invite.forEach(function(element){
						if(element===email){
							var index = invite.indexOf(email)
							invite.splice(index,1)
							event.invited = invite;
							event.save(function(err, event){
								if(err) throw err;
								res.json({ success: true, message: 'user removed' });
							});
						}
					} )

					rsvpd.forEach(function(element){
						if(element===email){
							var index = rsvpd.indexOf(email);
							rsvpd.splice(index,1);
							event.rsvp = rsvpd;
							event.save(function(err, event){
								if(err) throw err;
								res.json({ success: true, message: 'user removed' });
							});
						}
					} )	

				} else {
					res.json({ success: false, message: 'no email' });
				}
			}
		});
	});
	
	router.put('/viewEvent/:id/:email/:check', function(req, res){
		var eventID = req.params.id;
		var email = req.params.email;
		var check = req.params.check;
		console.log(req.params)

		Event.findOne({ eventId: eventID }, function(err, event){
			console.log(event)
			var invite = event.invited; 
			var invitedUsers = [];
			var rsvpd = event.rsvp;
			var rsvpUsers= []
			
			if(err) throw err;

			if(!event){
				console.log("no event")
				res.json({ success: false, message: 'Event was not found' });
			} else {
				User.findOne({ email: email }, function(err1, user){
					if(user){
						console
						if (check==="1"){
							console.log("invited");
							if(invite.includes(email)){
								res.json({ success: false, message: 'user already added' });	
							}else{
								invite.push(email)
								// Event.findOneAndUpdate(event.invited, {invited: invite}, function(err, event){
								// 	if(err) throw err;
								// 	res.json({ success: true, message: 'user added', event: event});
								// });
								event.invited = invite;
								event.save(function(err, event){
									if(err) throw err;
									res.json({ success: true, message: 'User added to invite list'});
								});
							}
						}else {
							console.log("Attending")
							if(rsvpd.includes(email)){
								res.json({ success: false, message: 'user already added' });
							} else {
								rsvpd.push(email)
								// Event.findOneAndUpdate(event.rsvp, {rsvp: rsvpd}, function(err, event){
								// 	if(err) throw err;
								// 	res.json({ success: true, message: 'user added' });
								// });
								event.rsvp = rsvpd;
								event.save(function(err, event){
									if(err) throw err;
									res.json({ success: true, message: 'User added to rsvp list'});
								});
							}
						}
					} else {
						console.log("No Users")
						res.json({ success: false, message: 'Could\'t find user with that email in database' });					
					}
				});	
			}
		});
	});

	router.put('/viewEvent/moveUser/:id/:email/:check', function(req, res){
		var eventID = req.params.id;
		var email = req.params.email;
		var check = req.params.check;
		console.log(req.params)

		Event.findOne({ eventId: eventID }, function(err, event){
			console.log(event)
			var invite = event.invited; 
			var rsvpd = event.rsvp;
			
			if(err) throw err;

			if(!event){
				console.log("no event")
				res.json({ success: false, message: 'Event was not found' });
			} else {
				User.findOne({ email: email }, function(err1, user){
					if(user){
							console.log("invited");
							if(rsvpd.includes(email)){
								res.json({ success: false, message: 'User is already attending' });	
							} else if(!invite.includes(email)){
								res.json({ success: false, message: 'User is not in the invited list for this event' });	
							}
							else{
								// Remove from invited
								var index = invite.indexOf(email);
								invite.splice(index, 1);

								// Add to rsvp
								rsvpd.push(email);
								event.invited = invite;
								event.rsvp = rsvpd;
								event.save(function(err){
									if(err) {
										throw err
									} else {
										res.json({ success: true, message: 'user added' });
									}
								});
								// Event.findOneAndUpdate(event.invited, {invited: invite}, function(err, event){
								// 	if(err) throw err;
								// 	res.json({ success: true, message: 'user added' });
								// });
							}
					} else {
						console.log("No Users")
						res.json({ success: false, message: 'Couldn\'t find user with that email in database' });					
					}
				});	
			}
		});
	});

	router.get('/editEvent/:id', function(req, res){
		let eventID = req.params.id;
		Event.findOne({ _id: eventID }, function(err, event){
				
			if(err) throw err;

			if(!event){
				res.json({ success: false, message: 'Event was not found' });
			} else {
					if(!event){
						res.json({ success: false, message: 'Event to edit was not found' });
					} else {
						res.json({ success: true, event: event});
					}		
					// res.json({ success: true, invitedUsers: invitedUsers, message: 'heres a message'});
			}
		});

		
	});

	router.put('/editEvent', function(req, res){
		
		var editEvent = req.body._id;
		if(req.body.name) 		var newName 		= req.body.name;
		if(req.body.venue) 		var newVenue		= req.body.venue;
		if(req.body.date)		var newDate 		= req.body.date;
		if(req.body.seatsPer)	var newSeats 	= req.body.seatsPer;
		if(req.body.tables)		var newTables 		= req.body.tables;
		// Check if current user has access to this
		User.findOne({ username: req.decoded.username }, function(err, mainUser){
			if(err) throw err;
					// NAME CHANGE
					if(newName){
						Event.findOne({_id: editEvent}, function(err, event){
							if(err) throw err;
							if(!event){
								res.json({ success: false, message: 'No event by this name was found' });
							} else {
								event.name = newName;
								event.venue = newVenue;
								event.date = newDate;
								event.seatsPer = newSeats;
								event.tables = newTables;
								event.save(function(err){
									if(err){
										console.log(err);
									} else {
										res.json({ success: true, message: 'Details have been changed' });
									}	
								});
							}
						});
					}

				});
				
			
		});

		router.put('/regGuest', function(req, res){
		
			var editEvent = req.body.eventId;
			if(req.body.vegetarian =='1') 		var newVegetarian		= req.body.vegetarian;
			console.log(req.body);
			if(req.body.vegan=='1') 		var newVegan		= req.body.vegan;
			if(req.body.coeliac=='1')		var newCoeliac 		= req.body.coeliac;
			if(req.body.otherInfo)	var newOtherInfo 	= req.body.otherInfo;
			// Check if current user has access to this
			User.findOne({ username: req.decoded.username }, function(err, mainUser){
				if(err) throw err;
						
							Event.findOne({eventId: editEvent}, function(err, event){
								if(err) throw err;
								if(!event){
									res.json({ success: false, message: 'No event by this name was found' });
								} else {
									if((newVegetarian) && (event.dietary.indexOf("Vegetarian")== -1)){
										event.dietary +='Vegetarian,';
									}
									if((newVegan) && (event.dietary.indexOf("Vegan")== -1)){
										event.dietary +='Vegan, ';
									}
									if((newCoeliac) && (event.dietary.indexOf("Coeliac")== -1)){
										event.dietary +='Coeliac, ';
									}
									if(newOtherInfo){
										event.otherInfo += '' + newOtherInfo + ', ';
									}
									
									event.save(function(err){
										if(err){
											console.log(err);
										} else {
											res.json({ success: true, message: 'Details have been submitted' });
										}	
									});
								}
							});
						
	
						
	
					});
					
				
			});	
	router.post('/eventSend', function(req, res){
 
        var subject = req.body.subject;
        var body = req.body.body;
        var recipients = req.body.to;
        if (req.body.subject == null || req.body.subject == "" || req.body.body == null || req.body.body == "" || req.body.to == null || req.body.to == ""){
        	res.json({success : false, message: "Please ensure all fields are filled in."});
        }
	    var email = {
	        from: 'Staff, staff@localhost.com',
	        to: 'staff@localhost.com',
	        bcc: recipients,
	        subject: subject,
	        text: body,
	        //(Do I need this???) html:
	   }
        client.sendMail(email, function(err, info){
            if (err){
                console.log(err);
            }
            else {
                console.log('Message sent: ' + info.response);
            }
        });
 
        res.json({success: true, message: 'Mail sent!'});
 
    });

    router.post('/buyTicket', function(req, res){
 		// get the current user..


    	console.log("You want to buy a ticket??")
    	var fs = require("fs");

    	var userName = req.decoded.username;
    	var userEmail = req.decoded.email;

    	

    	// // these may be null right now
     //    // var userEmail = req.body.userEmail;
     //    // var seat = req.body.seat;
     //    // var table = req.body.table;
     //    // var eventId = req.body.eventId;
     //    // var text = req.body.text;
     //    // hashstuff 
     	// some path stuff
     	const path = require('path');
     	const ABSPATH = path.dirname(process.mainModule.filename);


        var myText = "OMG"
        // var svg = qrImage.image(myText, {type: 'svg'});
        // var namePath = "../temp/" + myText;
        // var mypath = ABSPATH +"/temp/ohhmy.svg";
        var uniqueIdentifier = 'i_hate_qr.svg'
        var qr_svg = qrImage.image('I hate QR', {type: 'svg'});
        qr_svg.pipe(require('fs').createWriteStream(uniqueIdentifier));

        // var svg_string = qrImage.imageSync('I hate QR!!', {type: 'svg'});


        // fs.appendFile(namePath,jpg, function(){
        // 	console.log("done");
        // });



        // console.log("mypath = "+ mypath);
        // fs.appendFile(mypath ,svg, function(){
        // 	console.log("done");
        // });
        // console.log("ABSPATH = " + ABSPATH);
        // console.log("jpg : " + svg);
        // var qr_svg = qr.image('I love QR!', {type: 'svg'});
        //qr_svg.pipe(require('fs').createWriteStream('i_love_qr.svg'));
        // if (req.body.userEmail == null || req.body.userEmail == "" || req.body.seat == null || req.body.seat == "" || req.body.table == null || req.body.table == "" || req.body.eventId == null || req.body.eventId =="" || req.body.text ==null || req.body.text==""){
        // 	res.json({success : false, message: "Please ensure all fields are filled in."});
        // }
        // update the body to be the long html 
	    var email = {
	        from: 'Staff, staff@localhost.com',
	        to: 'ryann11@tcd.ie',
	        subject: "Your Ticket",
	        // this should be body
	        text: myText,
	        attachments:[
	        	{	
	        		 path: ABSPATH + '/'+ uniqueIdentifier
	        	}
	        ]
	    }
	        //(Do I need this???) html:
	   
	   // var mailOptions ={
	   // 		// ...
	   // 		html : 'Embedded image: <img src="cid:unique@kreata.ee"/>',
	   // 		attachments: [{
	   // 			filename : 'image.png',
	   // 			path: '/path/to/file',
	   // 			cid: 'unique@kreata.ee' //same value as img src
	   // 		}]
	   // }

        client.sendMail(email, function(err, info){
            if (err){
                console.log(err);
            }
            else {
                console.log('Message sent: ' + info.response);
            }
        });
 
        res.json({success: true, message: 'Ticket sent, check your email'});
 
    });

	
	return router; // Return the router object to server
}

