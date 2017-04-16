var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var transactionSchema = new Schema({
	status: Boolean, //Trạng thái thanh toán của giao dịch
	user_id: Number, //id của thành viên mua hàng, nếu không có tài khoản thì k lưu
	user_name : String, //Tên của khách hàng
	user_email: String, //Email của khách hàng
	user_phone : String, //Số điện thoại của khách hàng
	amount : Number, //tổng số tiền cần thanh toán
	created_at : Date,
	updated_at: Date, //Ngày tạo đơn hàng
	address:String
});
transactionSchema.pre('save',function(next){
	var currentDate = new Date().toISOString()
	this.updated_at = currentDate;
	if(!this.created_at){
		this.created_at = currentDate;
		next();
	}
});
module.exports = mongoose.model('Transaction', transactionSchema);