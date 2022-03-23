import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import Patient from "../models/patient.js";
import Doctor from "../models/doctor.js";
import { validationResult } from "express-validator";
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
  // get email, verify if users already exist
  // if not added to the right document as well, activate the account
  console.log(req.body);
  // let expiry = Date.now() + 60 * 1000 * 15; //Set expiry 15 mins ahead from now
  try {
    //exists function return objectId if user existed otherwise will return a null
    const existedUser = await User.exists({ email: req.body.email });
    console.log(existedUser);
    //if user is registered but the account was deleted which means the account is unavailable more
    // then they need to re-activate their accounts again
    if (existedUser && existedUser.active === 0) throw new Error("re-active");
    if (existedUser && existedUser.completed === 0)
      throw new Error("profile not completed");
    if (existedUser) throw new Error("user existed");
    if (req.body.password !== req.body.confirmPassword)
      throw new Error("password not match");
    const newUser = {
      email: req.body.email,
      password: req.body.password,
    };
    console.log(newUser);
    //hashing password
    const salt = await bcrypt.genSalt(8);
    const hashedPassword = await bcrypt.hash(newUser.password, salt);
    const code = Math.floor(100000 + Math.random() * 900000); //Generate random 6 digit code.
    // newUser.activationCode = code
    // console.log(newUser)
    const createdUser = await User.create({
      ...newUser,
      password: hashedPassword,
      active: 0,
      activationCode: code,
    });
    res.status(200).json({
      message: "registration successful, verify your account using code",
      code,
    });
    console.log(createdUser)
  } catch (err) {
    next(err);
  }
}
//verify account with code 
async function verifyAccount(req, res, next) {
  console.log(req.body.code)
  try{
    //check user id is right
    //should invitation link has user id
    // check valid key
    //if it's right activate and reset code to null
  } catch(err) {

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
    const passwordsMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );
    // console.log(passwordsMatch);
    if (!passwordsMatch) throw new Error("invalid login");
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
async function completeRegistration(req, res, nex) {
    try{

    } catch(err) {
        
    }
}
export default {
  getUsersList,
  register,
  verifyAccount,
  login,
};
