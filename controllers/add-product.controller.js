let product = require("../models/product.model");
let fs = require("fs");
let mongoose = require('mongoose');
exports.saveProduct = function (req, res) {
    let success = false, productadded = 0, productupdated = 0, message = `Product saved successfully.`;
    try {
        if (req.body.productimage) {
            var getUniqid = require('uniqid');
            var uniqid = getUniqid();
            let pathToDB = "assets/products/" + req.body.shopId;
            let dir = './dist/' + pathToDB;
            pathToDB = pathToDB + "/" + uniqid + ".png";
            if (!fs.existsSync(dir)) { fs.mkdirSync(dir); } //if directory does not exist create one
            let imgStorePath = dir + "/" + uniqid + ".png"
            var splitBinaryImage = req.body.productimage.split('base64,');
            fs.writeFile(imgStorePath, splitBinaryImage[1], 'base64', function (err) {
                if (err) {
                    console.log("Error while saving file");
                    message = "Error while saving image.Product not saved.";
                    res.json({ success: success, productupdated: productupdated, productadded: productadded, message: message });
                } else {
                    console.log("File saved");
                    _saveProduct(req, res, pathToDB);
                }
            });

        } else {
            _saveProduct(req, res);
        }
    } catch (e) {
        console.log("In catch");
        message = "Some Problem while performing action.Try again.";
        res.json({ success: success, productupdated: productupdated, productadded: productadded, message: message });
    }
}

function _saveProduct(req, res, pathToDB = "../assets/img/no-product.png") {
    let success = false, productadded = 0, productupdated = 0, message = `Product saved successfully.`;
    var outletsObj = [];
    req.body.outletsArr.forEach(function (element) {
        let outlet = null;
        if (req.body.is_homedeliveryavailable) {
            outlet = {
                address: element.itemName,
                id: element.id,
                contactnumber: element.mobile,
                workinghrs: element.workinghrs,
                ishomedelivery: true,
                homedelibrangeeryrange: req.body.range,
                homedeliverycharge: req.body.homedeliverycharge
            }
        } else {
            outlet = {
                id: element.id,
                address: element.itemName,
                contactnumber: element.mobile,
                workinghrs: element.workinghrs,
                ishomedelivery: false,
            }
        }
        outletsObj.push(outlet)
    });
    entry = { //if seller
        name: req.body.name,
        brandname: req.body.brand,
        imgurl: pathToDB,
        originalprice: req.body.originalprice,
        offer: req.body.discount,
        finalprice: req.body.finalprice,
        ratingby: [],
        rating: "0",
        category: req.body.catname,
        subcategory: req.body.subcatname,
        seller: {
            shopname: req.body.shopName,
            id: req.body.shopId
        },
        outlets: outletsObj,
        otherspecification: req.body.otherspecifications,
        specifications: req.body.specifications
    }
    if (req.body.prodid) delete entry.imgurl;
    let productObj = new product(entry);
    // productObj.save(function (err, result) {
    var query = { _id: req.body.prodid };
    if (!query._id) { //if object id not there then add new id to record
        query._id = new mongoose.mongo.ObjectID();
    }
    product.findOneAndUpdate(query, entry, { upsert: true,new: true }, function (err, result) {
        if (err) {
            console.log("err" + err);
            message = "Some Problem while performing action.Try again.";
        } else {
            if (result) {
                success = true;
                if (result['nModified']) {
                    productupdated = 1;
                    message = "Product updated successfully.";
                } else {
                    productadded = 1;
                    message = "Product has been Added successfully.";
                }
            } else {
                success = true;
                productadded = 0;
                message = "Some Problem while performing action.Try again.";
            }
        }
        res.json({ success: success, productupdated: productupdated, productadded: productadded, message: message });
    });

}


