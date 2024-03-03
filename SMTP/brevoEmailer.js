const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.BREVO_EMAIL, // generated ethereal user
    pass: process.env.BREVO_API_KEY, // generated ethereal key
  },
});
  // send mail with defined transport object
 const brevoEmailer = async(subject, html, to) =>{
  try{
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: '"Chopper IO" chopperIO@yopmail.com', // sender address
      to: to,
      subject: subject,
      html: html,
    });
    return info
  }catch(error){
    return error;
  }
}

module.exports = brevoEmailer;