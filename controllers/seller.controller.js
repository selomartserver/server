let user = require("../models/user.model");
let fs = require("fs");
exports.getSellerDetails = function (req, res) {
    var id = req.query.sellerid.trim();
    user.findOne({ "seller._id": id }, function (err, result) {
        console.log('into mongoose findone =' + result);
        let success = false, isAuthenticatedUser = false, error_code = 1, message = `Something went wrong ,while registering the user. Please try again.`;
        if (err) {
            console.log("err" + err);
        } else {
            success = true;
        }
        console.log("result =" + result)
        res.json({
            success: success,
            loggedInUserDetails: result,
            status_code: error_code,
            message: message,
            isAuthenticatedUser: isAuthenticatedUser
        });

    });
}

exports.saveSellerDetails = function (req, res) {

    let success = false, productupdated = 0, message = `Something went wrong ,while registering the user. Please try again.`;
    try {
        if (req.body.imgbanner) {
            var getUniqid = require('uniqid');
            var uniqid = getUniqid();
            let pathToDB = "assets/products/" + req.body.shopId;
            let dir = './dist/' + pathToDB;
            pathToDB = pathToDB + "/" + uniqid + ".png";
            if (!fs.existsSync(dir)) { fs.mkdirSync(dir); } //if directory does not exist create one
            let imgStorePath = dir + "/" + uniqid + ".png"
            var splitBinaryImage = req.body.imgbanner.split('base64,');
            fs.writeFile(imgStorePath, splitBinaryImage[1], 'base64', function (err) {
                if (err) {
                    console.log("Error while saving file");
                    message = "Error while saving image.Product not saved.";
                    res.json({ success: success, productupdated: productupdated, productadded: productadded, message: message });
                } else {
                    console.log("File saved");
                    _saveSellerDetails(req, res, pathToDB);
                }
            });

        } else {
            _saveSellerDetails(req, res);
        }


    } catch (e) {
        console.log("In catch");
        res.json({ success: success, recordsupdated: productupdated, message: message });
    }


    //original code

}

let findIdInLikes = function (likeArray, userId) {
    let search = function (element) {
        return element === userId;
    };
    let userFound = likeArray.some(search);
    console.log("userFound =", userFound);
    return userFound;
}
exports.likeSeller = function (req, res) {
    let productId = req.body.userId.trim();
    query = { "_id": productId }

    user.findOne(query, function (err, result) {
        let success = false, userAlreadyLiked = false, message = `Something went wrong. Please try again.`;
        if (err) {
            console.log("err" + err);
            res.json({
                success: success,
                message: message,
            });
        } else {
            userAlreadyLiked = findIdInLikes(result.seller.likes, productId);
            if (userAlreadyLiked) {
                success = true;
                message = `You have already liked this seller.`;
                res.json({ success: success, userAlreadyLiked: userAlreadyLiked, message: message });
            } else {
                user.update(query,
                    { $push: { "seller.likes": productId } }, function (err, result) {
                        let success = false, rowsInserted = false, message = "You liked this seller sucessfully.";
                        if (err) {
                            console.log("err" + err);
                            success = true;
                            message = "Some error occured, Please try again.";
                        } else {
                            if (result) {
                                success = true;
 } else { //
                                message = `seller not found.couldn't like.`;
                                success = true;
                            }
                        }
                        res.json({ success: success, userAlreadyLiked: userAlreadyLiked, message: message });
                    });

            }
        }

    });
}
function _saveSellerDetails(req, res, pathToDB = "../assets/img/no-product.png") {
    let success = false, productadded = 0, productupdated = 0, message = `Product saved successfully.`;
    var query = {
        mobile: req.body.contactnumber,
        "seller.shopname": req.body.shopname,
        "seller.shopowner": req.body.shopowner,
        "seller.shopinfo": req.body.shopinfo,
        "seller.shopwebsite": req.body.shopwebsite || "",
        "seller.outlets.0.mobile": req.body.contactnumber,
        "seller.imgbanner": pathToDB
    };

    user.where('_id', req.body.registrationid).update({ $set: query }, function (err, result) {

        // let success = false, rowsUpdated = false, message = "seller details updated successfully";
        if (err) {
            console.log("err" + err);
            message = "Some error occured, Please try again."
            res.json({ success: success, recordsupdated: rowsUpdated, message: message });
        } else {
            if (result) {
                success = true;
                rowsUpdated = 1
            } else { //
                message = `seller details not found.Try again.`;
                success = true;
            }
            res.json({ success: success, recordsupdated: rowsUpdated, message: message });
        }

    });

}
