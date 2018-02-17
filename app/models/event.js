var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var bcrypt   = require('bcrypt-nodejs');
var titlize      = require('mongoose-title-case');
var validate = require('mongoose-validator');

var UserSchema = new Schema({
	name:       {type: String, required: true},
	date:       {type: Date, required: true},
	venue:      {type: String, required: true},
	eventId:    {type: Number, required: true, unique: true},
	invided:    {type: [String], default: []},
	rsvp:       {type: [String], default: []},
	attended:   {type: [String], default: []},
	tables:     {type: Number},
	seatsPer:   {type: Number},
	description: {type: String, default: ''}
});
