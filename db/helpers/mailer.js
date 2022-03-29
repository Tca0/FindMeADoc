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
  try {
    const info = await transport.sendMail({
      from: process.env.EMAIL,
      to: toAddress,
      subject: "confirmation email",
      html: `<h1>Email Confirmation</h1>
        <h2>Hello</h2>
        <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
        // should be linked to the front end
        <a href=http://localhost:3000/users/confirm/${code}/account> Click here</a>
        </div>`,
    });
    return { err: false };
  } catch(err) {
    console.error("send-email-error", error);
    return {
      err: true,
      message: "Cannot send email",
    };
  }
}
async function sendResetPasswordEmail(toAddress, code){
  try{
    const info = transport.sendMail({
      from: process.env.EMAIL,
      to: toAddress,
      subject: "Reset Password Request",
      html: `<h1>Reset password</h1>
        <h2>Hello</h2>
        <p>click on the link to reset your password ${code}</p>
        // should be linked to the front end
        <a href=http://localhost:3000/resetPassword/${code}> Click here</a>
        </div>`,
    });
    return { err: false }
  } catch(err){
    console.error("send-email-error", error);
    return {
      err: true,
      message: "Cannot send email",
    };
  }
}
export default {
  sendConfirmationEmail,
  sendResetPasswordEmail
}
