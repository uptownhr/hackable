/*** Contact Model Schema ****/
var mongoose = require('mongoose');

var contactSchema = new mongoose.Schema({
	name: { type: String },
	email: { type: String },
	message: { type: String },
	created: { type: Date, default: Date.now()}

})

module.exports = mongoose.model('contact', contactSchema);