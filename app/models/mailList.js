var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var bcrypt   = require('bcrypt-nodejs');
var titlize      = require('mongoose-title-case');
var validate = require('mongoose-validator');

var MailListSchema = new Schema({
	name:       {type: String, required: true},
	members:    {type: [String], default: []}
});

module.exports = mongoose.model('MailList', MailListSchema);