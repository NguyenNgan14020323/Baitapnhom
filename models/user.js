var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Create a schema
var userSchema = new Schema({
	sex : Boolean,
	email : String,
	username : String,
	birthday : Date,
	password : String,
	created_at : Date,
	updated_at: Date
});

userSchema.pre('save',function(next){
	var currentDate = new Date().toISOString()
	this.updated_at = currentDate;
	if(!this.created_at){
		this.created_at = currentDate;
		next();
	}
});

var User = mongoose.model('User',userSchema);
module.exports = {
	User : User
}