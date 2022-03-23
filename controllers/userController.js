// import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import Patient from "../models/patient.js";
import Doctor from "../models/doctor.js";
import { validationResult } from "express-validator";
import passwordsFunctions from "../db/helpers/passwordsFunctions.js"
// get all users
async function getUsersList(req, res, next) {
  try {
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
    //exists function return objectId if user existed otherwise will return a null
    const existedUser = await User.exists({ email: req.body.email });
    //if user is registered but the account was deleted which means the account is unavailable more
    // then they need to re-activate their accounts again
    if (existedUser && existedUser.active === 0) throw new Error("not active");
    if (existedUser) throw new Error("user existed");
    if (!passwordsFunctions.confirmPassword(req.body.password,req.body.confirmPassword)) {
      throw new Error("password not confirmed")
    }
    const newUser = {
      email: req.body.email,
      password: req.body.password,
      role: req.body.role
    };
    console.log(newUser);
    //hashing password
    // const salt = await bcrypt.genSalt(8);
    // const hashedPassword = await bcrypt.hash(newUser.password, salt);
    const password = await passwordsFunctions.hashPassword(newUser.password);
    const code = Math.floor(100000 + Math.random() * 900000); //Generate random 6 digit code.
    const createdUser = await User.create({
      ...newUser,
      password: password,
      activationCode: code,
      //active account will be after verification process
    });
    console.log(createdUser.role)
    //According to the role add user to the right schema
    if (createdUser.role === "patient") {
      const newPatient = await Patient.create({
        email: createdUser.email,
        //active account will be after verification process
      });
    }
    if (createdUser.role === "doctor") {
      const newDoctor = await Doctor.create({
        email: createdUser.email,
        //active account will be after verification process
      });
    }
    res.status(200).json({
      message:
        "registration successful, login please to complete your registration to activate your account.",
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
    if (errors.errors.length !== 0) throw new Error("invalid email format");
    const user = await User.findOne({ email: req.body.email });
    // console.log(user);
    if (!user) throw new Error("invalid login");
    //it will compare the entered password with the hashed one(remember that)

    // const passwordsMatch = await bcrypt.compare(
    //   req.body.password,
    //   user.password
    // );
    // console.log(passwordsMatch);
    // if (!passwordsMatch) throw new Error("invalid login");

    const isItMatch = await passwordsFunctions.comparePassword(
      user.password,
      req.body.password
    );
    console.log("user controller", isItMatch);
    if(!isItMatch) throw new Error("invalid login");

    //creating a variable to cary logged in user (necessary info for user)
    const payload = {
      userId: user._id,
      email: user.email,
      role: user.role,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET);
    res.status(200).json({ payload, token });
  } catch (err) {
    next(err);
  }
}
//when users complete their profiles then account will assigned as completed
async function verifyAccount(req, res, next) {
  const { email, code } = req.body
  console.log(email, code)
  //user will attach the code with their email then we check if match then user account will be activated
    try{
      const user = await User.findOne({
        email: email
      })
      // console.log(user)
      console.log(user.activationCode)
      if(!user || user.activationCode !== code) throw new Error("invalid activation");
      //user existed and code is right ==> we need to set account as active and save data
      user.activationCode = null
      user.active = 1
      await user.save()
      res.status(200).json({ message: "Account activated, login please to complete your information"})
    } catch(err) {
      next(err)
    }
}
async function changePassword(req, res, next) {
  // current user will give access to user schema
  console.log(req.currentUser);
  //req body has new password and confirm new password
  // first this function will match the old password with the old one that stored
  // if it's match then it will check if new password and confirmPassword match
  //if it's then will set the new password after hashing it.
  const { oldPassword, newPassword, confirmPassword} = req.body
  try{
    const isItMatch = await passwordsFunctions.comparePassword(
    req.currentUser.password,
    oldPassword
  );
  if (!isItMatch) throw new Error("invalid old password");
  if (!passwordsFunctions.confirmPassword(newPassword, confirmPassword)) {
    throw new Error("password not confirmed");
  }
  const password = await passwordsFunctions.hashPassword(newPassword);
  const newUser = await User.findOneAndUpdate({ email: req.currentUser.email },
    { password: password },
    { new: true})
    res.status(200).json({ message: "password has been changed"})
  }
  catch(err) {
    next(err)
  }

}
export default {
  getUsersList,
  register,
  login,
  verifyAccount,
  changePassword
};
