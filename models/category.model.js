var mongoose = require('mongoose');

// var specificationsSchema = new mongoose.Schema({
//     name : String,
// });
var subcategoriesSchema = new mongoose.Schema({
    name : String,
    specifications:Object
});
var categoriesSchema = new mongoose.Schema({
    catname : String,
    subcategories:[subcategoriesSchema]
});
var categorySchema = new mongoose.Schema({
    groupname:String,
    categories:[categoriesSchema],
});

module.exports = mongoose.model('categories', categorySchema);
