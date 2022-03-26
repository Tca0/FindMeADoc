import jwt from "jsonwebtoken";
import User from "../models/user.js";
import Patient from "../models/patient.js";
import Doctor from "../models/doctor.js";
import { validationResult } from "express-validator";
import passwordsFunctions from "../db/helpers/passwordsFunctions.js";
import mailer from "../db/helpers/mailer.js"
// get all users
async function getUsersList(req, res, next) {
  const { currentUser } = body.req
  try {
    if(currentUser.role !== "admin") throw new Error("no-authentication")
    const users = await User.find({ active: 1 });
    console.log(users);
    if (users.length === 0) throw new Error("empty DB");
    res.send(users);
  } catch (err) {
    next(err);
  }
}
async function register(req, res, next) {
  try {
    const errors = validationResult(req);
    if (errors.errors.length !== 0) throw new Error(errors.errors[0].msg);
    //exists function return objectId if user existed otherwise will return a null
    const existedUser = await User.exists({ email: req.body.email });
    //if user is registered but the account was deleted which means the account is unavailable more
    // then they need to re-activate their accounts again

    if (existedUser && existedUser.active === 0) throw new Error("not active");
    if (existedUser) throw new Error("user existed");
    if (!passwordsFunctions.confirmPassword(  req.body.password,  req.body.confirmPassword)) {
      throw new Error("password not confirmed");
    }
    const newUser = {
      email: req.body.email,
      password: req.body.password,
      role: req.body.role,
    };
    //hashing password
    const password = await passwordsFunctions.hashPassword(newUser.password);
    const code = Math.floor(100000 + Math.random() * 900000); //Generate random 6 digit code.
    //try to send email for user
    // if succeed creat user other wise ask them to register with real email address
    const info = await mailer.sendConfirmationEmail(newUser.email, code);
    if(info.err) throw new Error("verification email failed")
    const createdUser = await User.create({
      ...newUser,
      password: password,
      activationCode: code,
      //active account will be after verification process
    });
    //According to the role add user to the right schema
    if (createdUser.role === "patient") {
      const newPatient = await Patient.create({
        email: createdUser.email,
      });
    }
    if (createdUser.role === "doctor") {
      const newDoctor = await Doctor.create({
        email: createdUser.email,
        
      });
    }
    res.status(200).json({
      message: "registration successful, verify your account using code",
      code,
    });
  } catch (err) {
    next(err);
  }
}

//login process and generating a token
async function login(req, res, next) {
  try {
    //handle email format error
    const errors = validationResult(req);
    console.log(errors.errors);
    if (errors.errors.length !== 0) throw new Error(errors.errors[0].msg);
    const user = await User.findOne({ email: req.body.email });
    console.log(user);
    if (!user) throw new Error("invalid login");
    if (!user.active) throw new Error("Not active");
    //it will compare the entered password with the hashed one(remember that)
    const isItMatch = await passwordsFunctions.comparePassword(
      user.password,
      req.body.password
    );
    let payload = {
    };
    if (!isItMatch) throw new Error("invalid login");
    if(user.role === "patient") {
      const patient = await Patient.findOne(({email: user.email}))
      payload = {
      userId: user._id,
      email: user.email,
      password: user.password,
      role: user.role,
      patientID: patient._id,
      name: patient.fullName
      }
    }
    //creating a variable to cary logged in user (necessary info for user)
    console.log(payload)
    const token = jwt.sign(payload, process.env.JWT_SECRET);
    res.status(200).json({ payload, token });
  } catch (err) {
    next(err);
  }
}
//when users complete their profiles then account will assigned as completed
async function verifyAccount(req, res, next) {
  console.log("route got hi")
  const { email, code } = req.body;
  console.log(email, code);
  //user will attach the code with their email then we check if match then user account will be activated
  try {
    const user = await User.findOne({
      email: email,
    });
    // console.log(user)
    console.log(user.activationCode);
    if (!user || user.activationCode !== code)
      throw new Error("invalid activation");
    //user existed and code is right ==> we need to set account as active and save data
    user.activationCode = null;
    user.active = 1;
    await user.save();
    res.status(200).json({
      message: "Account activated, login please to complete your information",
    });
  } catch (err) {
    next(err);
  }
}
async function changePassword(req, res, next) {
  // current user will give access to user schema
  //req body has new password and confirm new password
  // first this function will match the old password with the old one that stored
  // if it's match then it will check if new password and confirmPassword match
  //if it's then will set the new password after hashing it.
  const { oldPassword, newPassword, confirmPassword } = req.body;
  const { userId } = req.params
  const {currentUser} = req
  const errors = validationResult(req);
  // console.log(req.currentUser)
  try {
    console.log(currentUser);
    if (errors.errors.length !== 0) throw new Error(errors.errors[0].msg);
    if(userId !== currentUser.userId) throw new Error("no-authentication");
    const isItMatch = await passwordsFunctions.comparePassword(
      req.currentUser.password,
      oldPassword
    );
    if (!isItMatch) throw new Error("invalid old password");
    if (!passwordsFunctions.confirmPassword(newPassword, confirmPassword)) {
      throw new Error("password not confirmed");
    }
    const password = await passwordsFunctions.hashPassword(newPassword);
    const newUser = await User.findOneAndUpdate(
      { email: req.currentUser.email },
      { password: password },
      { new: true }
    );
    res.status(200).json({ message: "password has been changed" });
  } catch (err) {
    next(err);
  }
}
async function forgotPassword(req, res, next) {
  console.log(req.body);
  try {
    const errors = validationResult(req);
    console.log(errors.errors);
    if (errors.errors.length !== 0) throw new Error(errors.errors[0].msg);
    const { email } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) throw new Error("not registered");
    const code = Math.floor(100000 + Math.random() * 900000);
    // code will expire after 15 mins
    const expiry = Date.now() + 60 * 1000 * 15;
    //generating token to be sent as alink
    const payload = {
      userId: user._id,
      role: user.role,
      code: code
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET);
    //trying to store the value of sending male value in a variable but undefined
    const info = await mailer.sendResetPasswordEmail(email, token);
    if (info.err) {throw new Error("reset link failed");}
    console.log(user.resetPasswordToken, user.resetPasswordExpires);
    // user.resetPasswordToken = token;
    // user.resetPasswordExpires = new Date(expiry)
    console.log("before updating",user.resetPasswordToken, user.resetPasswordExpires);
    const passwordToReset = await User.findOneAndUpdate(
      {
        email: email,
      },
      {
        resetPasswordToken: token,
        resetPasswordExpires: new Date(expiry)
      },
      {new: true}
    );
    console.log(passwordToReset)
    res.status(200).json({ message: "check your email please", token });
  } catch (err) {
    next(err);
  }
}
async function resetPassword(req, res, next){
  const { newPassword, confirmPassword } = req.body
  const { token } = req.params
  // console.log(token)
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  // console.log(decodedToken)
  const errors = validationResult(req);
  try{
    if (errors.errors.length !== 0) throw new Error(errors.errors[0].msg);
    //test if code is valid
    // all steps that use code to reset and verify will change by converting codes to tokens
    const isItMatch = passwordsFunctions.confirmPassword(newPassword, confirmPassword)
    if(!isItMatch) throw new Error("password not confirmed");
    const user = await User.findOne({
      _id: decodedToken.userId,
      resetPasswordToken: token,
    });
    //check if token not expired
    // convert new password to hashed password
    // update document and save then return response.
    if(!user) throw new Error("no-authentication");
    const expiredLink = await User.findOne({
      _id: decodedToken.userId,
      resetPasswordExpires: { $gt: Date.now() },
    });
    console.log(expiredLink)
    if(!expiredLink) throw new Error("reset password expired")

    const newUser = await User.findOneAndUpdate(
      { _id: decodedToken.userId },
      { password: newPassword },
      { new: true }
    );
    res.status(200).json({message: "password has been reset, login again"})
  } catch(err){
    next(err)
  }
}
export default {
  getUsersList,
  register,
  verifyAccount,
  login,
  verifyAccount,
  changePassword,
  forgotPassword,
  resetPassword
};
