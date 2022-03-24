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
export default async function sendConfirmationEmail(toAddress, code) {
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
        <p>Thank you for subscribing. Please confirm your email by clicking on the following link ${code}</p>
        </div>`,
    });
  }
  catch(err) {
    console.log(err)
  }
}
