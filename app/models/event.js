var mongoose = require('mongoose');
var Schema   = mongoose.Schema;
var bcrypt   = require('bcrypt-nodejs');
var titlize      = require('mongoose-title-case');
var validate = require('mongoose-validator');

var EventSchema = new Schema({
	name:       {type: String, required: true},
	date:       {type: String, required: true},
	venue:      {type: String, required: true},
	eventId:    {type: String, required: true, unique: true},
	invited:    {type: [String], default: []},
	rsvp:       {type: [String], default: []},
	attended:   {type: [String], default: []},
	tables:     {type: Number},
	seatsPer:   {type: Number},
	description: {type: String, default: ''},
	menu:       {type: String, default: ''}
});

module.exports = mongoose.model('Event', EventSchema);