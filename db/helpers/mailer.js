// const nodemailer = require("nodemailer");
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
const transport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  },
});
async function sendConfirmationEmail(toAddress, code) {
  console.log(`trying to sent email to ${toAddress} with code ${code}`);
  console.log(transport)
  try {
    console.log("sending email to user")
    console.log(process.env.EMAIL, process.env.PASSWORD);
    console.log(process.env.CLIENT_ID, process.env.CLIENT_SECRET);
    await transport.sendMail({
      from: process.env.EMAIL,
      to: toAddress,
      subject: "confirmation email",
      html: `<h1>Email Confirmation</h1>
        <h2>Hello</h2>
        <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
        // should be linked to the front end
        <a href=http://localhost:4000/confirm/${code}> Click here</a>
        </div>`,
    });
  }
  catch(err) {
    console.log(err)
  }
}
async function sendResetPasswordEmail(toAddress, code){
  try{
    console.log("sending reset password code to:", toAddress)
    transport.sendMail({
      from: process.env.EMAIL,
      to: toAddress,
      subject: "Reset Password Request",
      html: `<h1>Reset password</h1>
        <h2>Hello</h2>
        <p>click on the link to reset your password ${code}</p>
        // should be linked to the front end
        <a href=http://localhost:4000/confirm/${code}> Click here</a>
        </div>`,
    });
  } catch(err){
    console.log("email not send")
    console.log(err)
  }
}
export default {
  sendConfirmationEmail,
  sendResetPasswordEmail
}
