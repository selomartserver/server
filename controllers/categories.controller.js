let category = require("../models/category.model");
exports.getCategories = function (req, res) {
    category.find({},function (err, result) {
        let success = false, message = `Something went wrong ,while fetching categoryData. Please try again.`;
        if (err) {
            console.log("err" + err);
        } else {
            if (result) {
                success = true;
                message = "Data fetch successfully.";
            } else {
                success = true;
             }
        }
        res.json({
            success: success,
            categoryList: result,
            message: message
        });
    });
}