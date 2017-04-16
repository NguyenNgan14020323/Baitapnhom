var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var orderSchema = new Schema({
	transaction_id : String, //id cua giao dich
	product_id : String, //id cua san pham
	qty : Number, // So luong san pham trong don hang
	amount : Number, //So tien cua don hang
	data : String, //luu du lieu nao do ma ban muon
	status: Boolean //Trang thai cua don hang
});

var Order = mongoose.model('Order',orderSchema);
module.exports = {
	Order:Order
}