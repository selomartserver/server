var express = require('express');
var router = express.Router();
let addProductCtrl = require("../controllers/add-product.controller");
let loginCtrl = require("../controllers/login.controller");
let productsCtrl = require("../controllers/products.controller");
let registrationCtrl = require("../controllers/registration.controller");
let sellerCtrl = require("../controllers/seller.controller");
let outletCtrl = require("../controllers/outlet.controller");
let categoryCtrl = require("../controllers/categories.controller");
/* router for user controller calls page. */
router.post('/login', function (req, res, next) {
    return loginCtrl.loginUser(req, res)
});
router.post('/send-pwd', function (req, res, next) {
    return loginCtrl.forgotPassword(req, res)
});
router.post('/registration', function (req, res, next) {
    return registrationCtrl.registerUser(req, res)
});
router.get('/seller-details', function (req, res) {
    return sellerCtrl.getSellerDetails(req, res)
});
router.post('/save-seller-details', function (req, res) {
    return sellerCtrl.saveSellerDetails(req, res)
});
router.post('/add-product', function (req, res) {
    return addProductCtrl.saveProduct(req, res)
});
router.get('/get-products', function (req, res) {
    return productsCtrl.getProducts(req, res)
});
router.post('/like-product', function (req, res) {
    return productsCtrl.likeProduct(req, res)
});
router.get('/get-prod-details', function (req, res) {
    return productsCtrl.getProductDetails(req, res)
});
router.post('/get-filtered-products', function (req, res) {
    return productsCtrl.getFilteredProducts(req, res)
});
router.post('/add-new-outlet', function (req, res) {
    return outletCtrl.saveOutlet(req, res)
});
router.get('/get-categories-data', function (req, res) {
    return categoryCtrl.getCategories(req, res)
});
router.post('/like-seller', function (req, res) {
    return sellerCtrl.likeSeller(req, res)
});
module.exports = router;//export the router
