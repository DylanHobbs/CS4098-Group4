var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt-nodejs');
var titlize = require('mongoose-title-case');
var validate = require('mongoose-validator');

var ticketSchema = new Schema({
	userId: 		{type: Number, require: true},
	event: 			{type: Object, require: true},
	table: 			{type: Number, require: true},
	seat: 			{type: Number, require: true},
	hash:			{type: String, require: true},
	confirmation:	{type: Boolean, require: true} 
});
