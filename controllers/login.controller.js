let user = require("../models/user.model");
exports.loginUser = function (req, res) {
    var entry = {
        "mobile": req.body.contactnumber,
        "password": req.body.password
    }
    user.findOne(entry, function (err, result) {
        let success = false, isAuthenticatedUser = false, message = `Something went wrong ,while registering the user. Please try again.`;
        if (err) {
            console.log("err" + err);
        } else {
            if (result) {
                success = true;
                isAuthenticatedUser = true;
                message = "You have logged in successfully.";
            } else {
                success = true;
                message = "Please check your login details and try again.";
            }
        }
        res.json({
            success: success,
            loggedInUserDetails: result,
            message: message,
            isAuthenticatedUser: isAuthenticatedUser
        });
    });
}

exports.forgotPassword = function (req, res) {
    let success = false, userNotFound=false, message = `Password has been sent to your registered Email id.`;
    var entry = {
        "email": req.body.mail.trim()
    }
    user.findOne(entry, function (err, result) {
        // let success = false, isAuthenticatedUser = false, message = `Something went wrong ,while registering the user. Please try again.`;
        if (err) {
            message = `Some problem occured.Try again later.`
            res.json({
                success: success,
                message: message,
                userNotFound:userNotFound
            });
        } else {
            if (result) {
                success = true;
                //send email functionality starts
                let  nodemailer = require('nodemailer');
                var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                           user: 'selomartservicedesk@gmail.com',
                           pass: 'Pravin1005'
                       }
                   });
                   let email=result.email,username=result.mobile,pwd=result.password                   ;
                   const mailOptions = {
                    from: 'selomartservicedesk@gmail.com', // sender address
                    to: email, // list of receivers
                    subject: 'Selomart: Forgot password', // Subject line
                    html:getEmailContent(username,pwd)// plain text body
                  };
                  transporter.sendMail(mailOptions, function (err, result) {
                    if(err){
                     console.log(err)
                     message = `There is some problem with email address. Please check and try again.`
                    }
                    else{
                        console.log(result);
                    }
                        res.json({
                        success: success,
                        message: message
                    });
                      
                 });
                 //send email functionality ends
            } else {
                userNotFound=true;success = true;
                message = "Email Id not found.Try again with registered email Id.";
                res.json({
                    success: success,
                    message: message,
                    userNotFound:userNotFound
                });
            }
        }
     
    });



}

let getEmailContent=function(userName,password){
    const emailContent=` <html>
    <body>
    <div align="center">
         <div style="max-width: 680px; min-width: 500px;  border: 2px solid #e3e3e3;border-radius:5px; margin-top: 20px">   
            <div  style="background-color: #fbfcfd; text-align: left;">
                <div style="margin: 30px;">
                     <p>
                         Dear User,<br><br> 
                         Welcome to Selomart!<br><br> 
                       Your Forgot Password request has been processed. Thank you for your interaction with us.<br><br>
                     </p>
                     <table style="text-align: left;">
                         <tr>
                             <th>UserName </th>
                             <td>: ${userName}</td>
                         </tr>
                         <tr>
                             <th>Password</th>
                             <td>: ${password}</td>
                         </tr>
                     </table>
                     <br>  
                     Visit Selomart  page <a href='https://www.selomart.com' target="_blank">www.selomart.com</a>  for further queries,
                     you can call us on 8793124147 or 9623044643.  
                    <br> <br> 
                        We recommend you to Reset password and delete this email.
                        Once again, thank you!!!<br><br> 
                    
                     <div>
                         With warm regards,<br>
                        <b>Selomart Team.</b>
                     </div>
                 </div>
            </div>   
        </div>   
    </div>
      <center>2018 © selomart. ALL Rights Reserved.</center>
    </body>
    </html>	`
return emailContent;
};

