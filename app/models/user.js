var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var bcrypt   = require('bcrypt-nodejs');
var titlize      = require('mongoose-title-case');
var validate = require('mongoose-validator');

// ****************************************************************************
// *                      Hardcore backend validation with RegEx                    *
// ****************************************************************************
// Name validator in form [Dylan Hobbs or Mary-Walter-Smith]
var nameValidator = [
	validate({
		validator: 'matches',
		arguments: /^(([a-zA-Z]{2,20})+[ ]+([a-zA-Z-]{2,20})*)+$/,
		message: 'Name must be at least 2 charecters per name, max 20. \nSpace seperarated. \nAllowed {a-z, A-Z, "-"}. \n Eg. John Doe or Susan Walter-Smith'
	}),
	validate({
	  validator: 'isLength',
	  arguments: [4, 25],
	  message: 'Name should be between {ARGS[0]} and {ARGS[1]} characters'
	})
];

// Email Validator in form dhobbs@tcd.ie. You know what an email looks like. I feel silly
var emailValidator = [
	validate({
		validator: 'isEmail',
		message: 'Not a valid email address.'
	}),
	validate({
	  validator: 'isLength',
	  arguments: [3, 25],
	  message: 'Email should be between {ARGS[0]} and {ARGS[1]} characters'
	}),
];

// Username Validator in form blahblah69 or XxN05c0pe420xX just keep it alpha / numeric and we G
var usernameValidator = [
	validate({
	  validator: 'isLength',
	  arguments: [3, 25],
	  message: 'Username should be between {ARGS[0]} and {ARGS[1]} characters'
	}),
	validate({
	  validator: 'isAlphanumeric',
	  message: 'Username must contain letters and numbers only'
	})
];

// Password Validator. 8-40 charecters. At least one capital letter, one symbol and one number
var passwordValidator = [
	validate({
		validator: 'matches',
		arguments: /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,128}$/,
		message: 'Password must be longer than 8 charecrers and contain at least one symbol, upper case letter and number'
	}),
	validate({
	  validator: 'isLength',
	  arguments: [8, 128],
	  message: 'Password should be between {ARGS[0]} and {ARGS[1]} characters'
	})
];

// ****************************************************************************
// *                             Start User Schema                            *
// ****************************************************************************
var UserSchema = new Schema({
	name:       {type: String, required: true, validate: nameValidator},
	username:   {type: String, lowercase: true, required: true, unique: true, validate: usernameValidator},
	password:   {type: String, required: true, validate: passwordValidator, select: false},
	email:      {type: String, lowercase: true, required: true, unique: true, validate: emailValidator},
	active:     {type: Boolean, required: true, default: false},
	tmpToken:   {type: String, required: true},
	permission: {type: String, required: true, default: 'user'} // user -> host -> admin
});


// Middleware for hashing passwords
UserSchema.pre('save', function(next){
	var user = this;

	// If password hasn't been changed, no need to do the passowrd check
	if(!user.isModified('password')) return next();

	bcrypt.hash(user.password, null, null, function(err, hash){
		if(err) return next(err);
		user.password = hash;
		next();
	});
});

// Mongoose plugin to make names automatically "Title Case"
UserSchema.plugin(titlize, {
  paths: [ 'name' ]
});

// Middleware for password validation
// Using a custom function for the MongoDB
UserSchema.methods.comparePasswords = function(password){
	return bcrypt.compareSync(password, this.password);
};

// // Custom function for setting new password
// UserSchema.method.setPassword = function(password){
// 	bcrypt.hash("bacon", null, null, function(err, hash) {
//     	// Store hash in your password DB.
// 	});
// }

module.exports = mongoose.model('User', UserSchema);
