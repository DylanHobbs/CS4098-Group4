var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var bcrypt   = require('bcrypt-nodejs');
var titlize      = require('mongoose-title-case');
var validate = require('mongoose-validator');

var GuestSchema = new Schema({
	name:       {type: String, required: true},
    email:      {type: String, lowercase: true, unique: true},
    number:      {type: String, required: true, unique: true}
});

module.exports = mongoose.model('Guest', GuestSchema);