let user = require("../models/user.model");
exports.saveOutlet = function (req, res) {
    var outletEntry = {
        address: req.body.address,
        location: req.body.location,
        workinghrs: req.body.working_hours, zip: req.body.zip,
        mobile: req.body.phone, city: req.body.city
    };
    user.update(
        { _id: req.body.shopid },
        { $push: { "seller.outlets": outletEntry } }, function (err, result) {
            let success = false, rowsInserted = false, message = "Some error occured, Please try again.";
            if (err) {
                console.log("err" + err);
            } else {
                if (result) {
                    success = true;
                    rowsInserted = true
                    message= "Your shop outlet added successfully";
                } else { //
                    message = `Seller details not found.Could not add outlet.`;
                    success = true;
                }
                res.json({ success: success, rowsInserted: rowsInserted, message: message });
            }
    });
}

