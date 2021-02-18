const nodemailer = require("nodemailer");

module.exports = function node(data, email) {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "twofactorauthentication2021@gmail.com",
      pass: "Demo@1234"
    }
  });

  var maillist = [email];
  console.log(email,data)
  let mailOptions = {
    from: "TWO FACTOR AUTHENTICATION",
    to: maillist,
    subject: "LOGIN OTP",
    text:`The OTP for yours account is ${data}. Please dont share your Otp with others.`
      
  };

  transporter.sendMail(mailOptions, (err, data) => {
    if (err) {
      return console.log("Error occurs",err);
    }
    return console.log("Email sent!!!");
  });
};