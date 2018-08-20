let mongoose = require('mongoose');

 let specificationsSchema = new mongoose.Schema({
	 name : String,
	 unit : String,
	 type : String,
	 value : [{val:String,}]
 });

let sellerSchema = new mongoose.Schema({
  shopname: String,
  shopowner: String,
  id: String
});
let outletSchema = new mongoose.Schema({
  id:String,
  address: String,
  contactnumber: String,
  workinghrs:String,
  ishomedelivery: Boolean,
  homedelibrangeeryrange: {type:String ,default :"0"},
  homedeliverycharge: {type:String ,default :"0"}
});
let albumnSchema = new mongoose.Schema( {data: Buffer, contentType: String })
let productSchema = new mongoose.Schema({
  name: String,
  brandname: String,
  imgurl :String,
  originalprice: String,
  offer: Number,
  finalprice: String,
  ratingby: [String],
  rating: String,
  category: String,
  subcategory: String,
  specifications: [specificationsSchema],
  seller: sellerSchema,
  outlets: [outletSchema],
  likes: [String],
  otherspecification: String,
  added_datetime: { type: Date, default: Date.now },
  updated_datetime: { type: Date, default: Date.now }
});

module.exports = mongoose.model('products', productSchema);

