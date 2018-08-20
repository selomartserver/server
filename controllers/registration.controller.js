let user = require("../models/user.model");
exports.registerUser = function (req, res) {
    let query = { $or: [{ "mobile": req.body.contactnumber }, 
    { "email": req.body.email }] };
    user.findOne(query, function (err, result) {
        let success = false, rowsInserted = 0, isUsernameAlreadyPresent = false, message = `Something went wrong ,while registering the user. Please try again.`;
        if (err) {
            console.log("err" + err);
            res.json({ success: success, rowsInserted: rowsInserted, isUsernameAlreadyPresent: isUsernameAlreadyPresent, message: message });

        } else {
            if (result) {
                success = true;
                isUsernameAlreadyPresent = true;
                message = `Emaild or contact number already registered.Try with different input.`;
                res.json({ success: success, rowsInserted: rowsInserted, isUsernameAlreadyPresent: isUsernameAlreadyPresent, message: message });
            } else { //if user not found ,then save new user in db
                var entry;
                if (!req.body.isSeller) { //if not seller
                    entry = {
                        mobile: req.body.contactnumber,
                        email: req.body.email,
                        isseller: req.body.isSeller,
                        password: req.body.password
                    }
                } else {
                    entry = { //if seller
                        mobile: req.body.contactnumber,
                        email: req.body.email,
                        isseller: req.body.isSeller,
                        password: req.body.password,
                        seller: {
                            shopname: req.body.shopname,
                            shopowner: req.body.shopownername,
                            imgbanner:"",
                            website:req.body.website,
                            shopinfo: `Thanks for visiting our page give use more 
                            opportunities to serve you better.`,
                            outlets: [
                                {
                                    address: req.body.address,
                                    Itemname: req.body.address,
                                    location: req.body.lat_long_details,
                                    workinghrs: req.body.working_hours,
                                    city: req.body.city,
                                    zip: req.body.zip,
                                    mobile: req.body.contactnumber
                                }
                            ]
                        }
                    }
                };
                let userObj = new user(entry);
                userObj.save(function (err, result) {
                    // let rowsInserted = 1;
                    if (err) {
                        console.log("err" + err);
                    } else {
                        if (result) {
                            success = true;
                            rowsInserted = 1;
                            message = "User has registered successfully.Login and continue.";
                        } else {
                            success = true;
                            rowsInserted = 0;
                            message = "Some Problem while registering user.Try again.";
                        }
                    }
                    res.json({ success: success, rowsInserted: rowsInserted, isUsernameAlreadyPresent: isUsernameAlreadyPresent, message: message });

                });

            }


        }
    });

}

