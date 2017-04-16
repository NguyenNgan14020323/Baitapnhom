var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var adminSchema = new Schema({
	email: String,
	username: String,
	password :String,
});
var Admin = mongoose.model('Admin',adminSchema);
module.exports = {
	Admin : Admin
}