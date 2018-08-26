let product = require("../models/product.model");
exports.getProducts = function (req, res) {
    let productId = req.query.shopId.trim();
    let pageNo = parseInt(req.query.pageNumber) || 1;
    let size = parseInt(req.query.pageSize) || 16;
    if (pageNo < 0 || pageNo === 0) {
        response = { "error": true, "message": "invalid page number, should start with 1" };
        return res.json(response)
    }
    let query;
    if (productId === "-") {
        query = {}
    } else {
        query = { "seller.id": productId }
    }
    product.count(function (err, count) {
        if (err) {
            res.json({
                success: false,
                message: `Something went wrong ,while fetching products.Please try again.`,
            });
        }
        product.
            find(query).
            limit(size).
            skip(size * (pageNo - 1)).
            //   select('name occupation').
            exec(function (err, result) {
                let success = false, message = "Products fetch successfully.";
                if (err) {
                    message = `Something went wrong ,while fetching products.Please try again.`;
                } else {
                    success = true;
                }
                res.json({
                    success: success,
                    productsList: result,
                    totalItems: count,
                    message: message,
                });
  });
    });
}

exports.getFilteredProducts = function (req, res) {
    var filter = [];
    if (req.body.selectedFilters) {
        req.body.selectedFilters.forEach(obj => {
            var values = [];
            obj.value.forEach(o => { values.push(o.val) });
            filter.push({
                $and: [
                    { 'category': req.body.category },
                    { 'subcategory': req.body.subcategory },
                    { 'specifications.name': obj.name },
                    { 'specifications.value.val': { $in: values } }
                ]
            });
        });
    } else if (req.body.category && !req.body.subcategory && !req.body.selectedFilters) {///selecting category
        filter.push({
            $and: [{ 'category': req.body.category }]
        });
    } else if (req.body.subcategory && !req.body.selectedFilters) {///selecting subcategory
        filter.push({
            $and: [
                { 'category': req.body.category },
                { 'subcategory': req.body.subcategory }
            ]
        });
    }
    var query = { $and: filter };
    product.count(function (err, count) {
        product.find(query, function (err, result) {
            let success = false, message = `Something went wrong. Please try again.`;
            if (err) { console.log("err" + err); }
            else { success = true; }
            res.json({
                success: success,
                productsList: result,
                totalItems: result.length,
                message: message,
            });
        });
    });


    // var pageNo = parseInt(req.body.pageNumber) || 1;
    // var size = parseInt(req.body.pageSize) || 3;
    // console.log("Body in get produtcs =" + JSON.stringify(req.query));
    // // console.log("parse ="+JSON.parse(req.query.query));
    // // var pageNo = parseInt(req.query.pageNo)
    // // var size = parseInt(req.query.size)
    // if (pageNo < 0 || pageNo === 0) {
    //     response = { "error": true, "message": "invalid page number, should start with 1" };
    //     return res.json(response)
    // }
    // // let queryFilteredProducts = {
    // //     $or: [
    // //         { $and: [{ 'specifications.name': 'color' }, { 'specifications.value.val': { $in: ['Red', 'DARKKHAKI'] } }] },
    // //         { $and: [{ 'specifications.name': 'size' }, { 'specifications.value.val': { $in: ['324'] } }] }
    // //     ]
    // // };

    // let query;
    // query = queryFilteredProducts
    // query.skip = size * (pageNo - 1)
    // query.limit = size

    // product.count(function (err, count) {
    //     product.find(req.query.query).
    //         // where('name.last').equals('Ghost').
    //         // where('age').gt(17).lt(66).
    //         // where('likes').in(['vaporizing', 'talking']).
    //         limit(size).
    //         skip(size * (pageNo - 1)).
    //         // sort('-occupation').
    //         // select('name occupation').
    //         exec(function (err, result) {
    //             console.log('into mongoose findone =' + result);
    //             let success = false, message = `Something went wrong ,while registering the user. Please try again.`;
    //             if (err) {
    //                 console.log("err" + err);
    //             } else {
    //                 success = true;
    //             }
    //             //  console.log("result =" + result)
    //             res.json({
    //                 success: success,
    //                 productsList: result,
    //                 totalItems: count,
    //                 message: message,
    //             });

    //         });
    // });



}



exports.getProductDetails = function (req, res) {
    let productId = req.query.productid.trim();
    query = { "_id": productId }
    product.count(function (err, count) {
        // Assuming no errors, 'count' should have your answer
        product.find(query, function (err, result) {
            console.log('into mongoose findone =' + result);
            let success = false, message = `Something went wrong ,while registering the user. Please try again.`;
            if (err) {
                console.log("err" + err);
            } else {
                success = true;
                message = `Data fetched successfully.`
            }
            //  console.log("result =" + result)
            res.json({
                success: success,
                productsData: result,
                message: message,
            });

        });
    });
}
let findIdInLikes = function (likeArray, userId) {
    let search = function (element) {
        return element === userId;
    };
    let userFound = likeArray.some(search);
    console.log("userFound =", userFound);
    return userFound;
}
exports.likeProduct = function (req, res) {
    let productId = req.body.productId.trim();
    query = { "_id": productId }

    product.findOne(query, function (err, result) {
        let success = false, userAlreadyLiked = false, message = `Something went wrong ,while registering the user. Please try again.`;
        if (err) {
            console.log("err" + err);
            res.json({
                success: success,
                message: message,
            });
        } else {
            userAlreadyLiked = findIdInLikes(result.likes, productId);
            if (userAlreadyLiked) {
                success = true;
                message = `You have already liked this product`;
                res.json({ success: success, userAlreadyLiked: userAlreadyLiked, message: message });
            } else {
                product.update(query,
                    { $push: { "likes": productId } }, function (err, result) {
                        let success = false, rowsInserted = false, message = "You liked this product sucessfully.";
                        if (err) {
                            console.log("err" + err);
                            success = true;
                            message = "Some error occured, Please try again.";
                        } else {
                            if (result) {
                                success = true;
 } else { //
                                message = `Product not found.couldn't like.`;
                                success = true;
                            }
                        }
                        res.json({ success: success, userAlreadyLiked: userAlreadyLiked, message: message });
                    });

            }
        }

    });
}



