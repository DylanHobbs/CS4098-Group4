// ****************************************************************************
// *                              Backend Routes                              *
// ****************************************************************************
var User    = require('../models/user');
var Event   = require('../models/event');
var Guest   = require('../models/guest');
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
	 var crypto = require('crypto'),
	 		algorithm = 'aes-256-ctr',
	 		password = 'd6F3Efeq';

	function encrypt(text){
		var cipher = crypto.createCipher(algorithm,password)
		var crypted = cipher.update(text,'utf8', 'hex')
		crypted += cipher.final('hex');
		return crypted
	}

	function decrypt(text){
		var decipher = crypto.createDecipher(algorithm, password)
		var dec = decipher.update(text,'hex', 'utf8')
		dec += decipher.final('utf8');
		return dec;
	}


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

	router.post('/guests', function(req, res){
		var guest = new Guest();
		guest.number = req.body.number;
		guest.email    = req.body.email;
		guest.name     = req.body.name;

		if(req.body.number == null || req.body.name == null || req.body.name == ''){
			res.json({success: false, message: 'Ensure name and number are provided'});
		} else {
			console.log("HELLO");
			guest.save(function(err){
				if(err){
					console.log(err);
					if(err.errors != null){ 
						if(err.errors.name){
							res.json({success: false, message: err.errors.name.message});
						} else if(err.errors.email){
							res.json({success: false, message: err.errors.email.message});
						}else {
							res.json({success: false, message: err});
						}
					} 
				} else {
					res.json({success: true, message: 'User Registered'});
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
		User.findOne({ email: req.decoded.email }).select('email name username total numberOfDonations').exec(function(err, user) {
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
				//TODO :ask dylan if this is hacking ;)
				//if(mainUser.permission === 'admin'){
					User.findOne({_id: editUser}, function(err, user){
						if(err) throw err;
						if(!user){
							res.json({ success: false, message: 'User to edit was not found' });
						} else {
							res.json({ success: true, user: user});
						}
					});
				//} else {
				//	res.json({ success: false, message: 'You don\'t have the correct permissions to access this' });
				//}
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

	router.get('/donationStats', function(req, res){
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

	router.post('/donate', function(req, res){
		var success = false;

		console.log(req.body);
		var amount = req.body.donation;
		if(req.body.event){
			var eventid = req.body.event;
		}
		// Update user amount
		User.findOne({ email: req.decoded.email }, function(err, user){
			if(err) throw err;
			if(!user){
				res.json({ success: false, message: 'No user was found' });
			} else {
				if (amount){
					user.totalDonated+=amount;
					user.numberOfDonations+=1;
					user.save(function(err, user){
						if(err) throw err;
						success = true;
					});
				} else {
					res.json({ success: false, message: 'No donation was found' });
				}
				
			}
		});

		//Update event amount
		if(eventid){
			Event.findOne({eventId: eventid}, function(err, event){
				if(err) throw err;
				console.log(event);
				if(!event){
					res.json({ success: false, message: 'No event was found' });
				} else {
					if(amount){
						event.raised = event.raised + amount;
						event.numDonate = event.numDonate + 1;
						event.save(function(err, event){
							if(err) throw err;
							res.json({ success: true, message: 'Donation was successful for user and event'});
						});
					} else {
						res.json({ success: false, message: 'No donation was found' });
					}
				}
			});
		}
		if(success){
			res.json({ success: true, message: 'Donation was successful'});
		}
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

	router.get('/viewEventUser/:id', function(req, res){
		attending = false;
		var eventID = req.params.id;
		User.findOne({ username: req.decoded.username }, function(err, mainUser){
			Event.findOne({ eventId: eventID }, function(err, event){
				if(err) throw err;
				if(!event){
					res.json({ success: false, message: 'Event was not found' });
				} else {
						var rsvp = event.rsvp;
						index = rsvp.indexOf(mainUser.email);
						if(index > -1){
							attending = true;
						}
						// need to make a callback function for this
						setTimeout(function() {
							res.json({ success: true, event: event, attending: attending,  message: 'heres a message'});
						}, 10);
				}
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
					var rsvpUsers= [];
					var rsvpGuests= [];
					var guestrsvp= event.guestrsvp;
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


					guestrsvp.forEach(function(element){
						
						Guest.findOne({number: element}, function(err, guest){
							if(err) throw err;
							console.log(guest);
							rsvpGuests.push(guest);
						});

					} )
					
					console.log(rsvpGuests);
				

					// need to make a callback function for this
					setTimeout(function() {
						res.json({ success: true, event: event, invitedUsers: invitedUsers,rsvpUsers: rsvpUsers, rsvpGuests: rsvpGuests, message: 'heres a message'});

						}, 2000);
					// res.json({ success: true, invitedUsers: invitedUsers, message: 'heres a message'});

			}
		});
	});

	//delete event
	router.delete('/deleteEvent/:id', function(req, res){
		var eventId = req.params.id;

		Event.findOneAndRemove({eventId: eventId}, function(err, event){
			if(err) throw err;
			res.json({ success: true, message: 'Event was deleted' });
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
					});

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
					});

				} else {
					res.json({ success: false, message: 'no email' });
				}
			}
		});
	});

	router.delete('/viewEventGuest/:id/:phone', function(req, res){
		var eventID = req.params.id;
		var phone = req.params.phone;

		Event.findOne({ eventId: eventID }, function(err, event){

			var rsvpd = event.guestrsvp;
						
			
			if(err) throw err;

			if(!event){
				console.log("no event")
				res.json({ success: false, message: 'Event was not found' });
			} else {
				if(phone){

					index = rsvpd.indexOf(phone);
					
					if(index > -1){
						rsvpd.splice(index,1);
						event.guestrsvp = rsvpd;
							event.save(function(err, event){
								if(err) throw err;
								res.json({ success: true, message: 'User removed' });
							});
					}
					

				} else {
					res.json({ success: false, message: 'no phone number' });
				}
			}
		});
	});

	
	router.put('/viewEvent/:id/:email/:check', function(req, res){
		var eventID = req.params.id;
		var email = req.params.email;
		var check = req.params.check;
		console.log(req.params)
		console.log("we inviting somebody")
		console.log("email :" + email)
		var myEmail = email
		
		

		

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
								var hashString = user._id + "+" + eventID;
								var encoded = encrypt(hashString)
								var decoded = decrypt(encoded)
								console.log("encoded : " + encoded);
								console.log("decoded : " + decoded);
								console.log("email : " + myEmail);
								var rsvpLinkAddress = "http://localhost:8080/registerForEvent/"+ encoded;
								var bodyText = "You have been invited to rsvp for our event, please go to the link to rsvp\n" + 
								rsvpLinkAddress + "\n Event Details : " + event.description;
								var emails = {
							        from: 'Staff, staff@localhost.com',
							        to: myEmail,
							        subject: "RSVP - " + event.name,
							        // this should be body
							        text: bodyText,
						        }
						        client.sendMail(emails, function(err, info){
						            if (err){
						                console.log(err);
						            }
						            else {
						                console.log('Message sent: ' + info.response);
						            }
						        });



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

	router.put('/RSVP/:id', function(req, res){
		var eventID = req.params.id;
		User.findOne({ username: req.decoded.username }, function(err, mainUser){
			if(err) throw err;
			
			//var check = req.params.check;

			Event.findOne({ eventId: eventID }, function(err, event){
				console.log(event)
				var rsvpd = event.rsvp;
				var invite = event.invited; 
				if(err) throw err;

				if(!event){
					console.log("no event")
					res.json({ success: false, message: 'Event was not found' });
				} else {
					
								console.log("RSVPing");

									var index = invite.indexOf(mainUser.email);
									if(index > -1){
										invite.splice(index, 1);
									}
									
									// Add to rsvp
									event.invited = invite;
									rsvpd.push(mainUser.email);
									event.rsvp = rsvpd;
									event.save(function(err){
										if(err) {
											throw err
										} else {
											res.json({ success: true, message: 'You have RSVP\'d!' });
										}
									});
									// Event.findOneAndUpdate(event.invited, {invited: invite}, function(err, event){
									// 	if(err) throw err;
									// 	res.json({ success: true, message: 'user added' });
									// });
					}
					});	
	
		});
	});

	router.delete('/unRSVP/:id', function(req, res){
		var eventID = req.params.id;
		User.findOne({ username: req.decoded.username }, function(err, mainUser){
			if(err) throw err;
			
			//var check = req.params.check;

			Event.findOne({ eventId: eventID }, function(err, event){
				console.log(event)
				var rsvpd = event.rsvp;
				var invite = event.invited; 
				if(err) throw err;

				if(!event){
					console.log("no event")
					res.json({ success: false, message: 'Event was not found' });
				} else {
					
								console.log("unRSVPing");
							
									invite.push(mainUser.email);
									event.invited = invite;
									// Remove from rsvp
									index = rsvpd.indexOf(mainUser.email);

									if(index > -1){
										rsvpd.splice(index,1);
										
											
									}
									event.rsvp = rsvpd;
									event.save(function(err, event){
										if(err) throw err;
										res.json({ success: true, message: 'User removed' });
									});		
								
									// Event.findOneAndUpdate(event.invited, {invited: invite}, function(err, event){
									// 	if(err) throw err;
									// 	res.json({ success: true, message: 'user added' });
									// });
					}
					});	
	
		});
	});



	router.put('/addGuest/:id/:number/', function(req, res){
		var eventID = req.params.id;
		var number = req.params.number;
		console.log(req.params);

		Event.findOne({ eventId: eventID }, function(err, event){
			console.log(event);
			var invite = event.invited; 
			var rsvpd = event.guestrsvp;
			
			if(err) throw err;

			if(!event){
				console.log("no event")
				res.json({ success: false, message: 'Event was not found' });
			} else {
				rsvpd.push(number.toString());
				event.guestrsvp = rsvpd;
								event.save(function(err){
									if(err) {
										throw err
									} else {
										res.json({ success: true, message: 'User added' });
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
		if(req.body.menu)		var newMenu 		= req.body.menu;
		if(req.body.description)		var newDescription 		= req.body.description;
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
								event.menu = newMenu;
								event.description = newDescription;
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
    	console.log("eventId : "+ req.body.eventId)
    	console.log("userEmail :" + userEmail);
    	console.log("userName : "+ userName);
    	// Add the now paid users email to the paid list of the correct event
    	// Not sure this is working right now..
    	Event.findOne({eventId : req.body.eventId}, function(err, event){
    		if(err){
    			throw err;
    		}
    		if(!event){
    			console.log("No event??")
				res.json({ success: false, message: 'No event by this name was found' });
			} else {
				var paid = event.paid;
				if(paid.includes(userEmail)){
					console.log("This person has already paid");
				}
				else{
					console.log("pushing user email to paid");
				
					paid.push(userEmail);

					event.save(function(err, event){
					if(err) throw err;

					console.log("user successfully added to paid")
						// res.json({ success: true, message: 'User added to paid list'});
					});
				}
			}
    	});

    	

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

     	// hash these
        var myText = userName
        // var svg = qrImage.image(myText, {type: 'svg'});
        // var namePath = "../temp/" + myText;
        // var mypath = ABSPATH +"/temp/ohhmy.svg";
        var uniqueIdentifier = userName+'.svg'
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

    router.get('/decryptHash/:id', function(req, res){

    	
		var hash = req.params.id;
		console.log("Decrypting")
		console.log("HASH == " + hash)
		
		var decrypted = decrypt(hash)
	    console.log("decrypted : " +decrypted)

	    var split = decrypted.split('+');
	    var userId = split[0];
	    var eventId = split[1];
	    console.log("eventId = "+ eventId);
	    console.log("userName = " + userId);
	    console.log("registerForEventCtrl here!!!")
	    Event.findOne({eventId : eventId}, function(err, event){
	    	if (err){ 
	    		throw err;
	    	}
	    	var invited = event.invited;
	    	var paid = event.paid;
	    	// for (let element of invited){
				// console.log("element :: "+ element);
				// console.log("userId :: "+ userId);
				User.findOne({_id : userId}, function(err, user){
					if(err){
						throw err;
					}
					if(invited.includes(user.email)){
						console.log("This person is indeed invited")
						if(!paid.includes(user.email)){
							console.log("YOU HAVE NOT PAID, you filthy animal!!");
							res.json({success: true, userid: userId, eventid: eventId, message : 'You have not paid yet unfortunately'});
							return;
						}else{
							res.json({success: true, userid: userId, eventid: eventId, message: 'decrypted correctly'});
							return;
						}	
					}
					else{
						console.log("How did we get here")
						res.json({success: false, message : "user is not invited actually.. cannot be rsvp"})
						return
					}
				});
			// }
			
	    })

	    //res.json({success: false, message : "Event not found??"})
		//	return
		

		

		});

     // MAIL LIST ROUTES

	router.post('/createList', function(req, res){

    	var list = new MailList();
    	list.name = req.body.name;

    	if(req.body.name == null || req.body.name == ''){
			res.json({success: false, message: 'Ensure all input fields are filled in'});
		} else {
			list.save(function(err){
				if(err) throw err;
				res.json({success: true, message: 'Mail List Created'});
			});
		}

    });

    router.get('/mailLists', function(req, res){
		MailList.find({}, function(err, mailLists){
			
			if(err) throw err;
			//Check if they're allowed use this route
			User.findOne({ username: req.decoded.username }, function(err, mainUser){
				if(err) throw err;
				if(!mainUser){
					res.json({ success: false, message: 'User was not found' });
				} else {
				//	if(mainUser.permission === 'admin'){
						// Exitst and has permission
						if(!mailLists){
							res.json({ success: false, message: 'MailLists[s] not found' });
						} else {
							res.json({ success: true, mailLists: mailLists, permission: mainUser.permission });
						}
					} 
					//else {
				//		res.json({ success: false, message: 'You don\'t have the correct permissions to access this' });
				//	}
				//}
			});
 		});
	}); 


	
	return router; // Return the router object to server
}

