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
  try {
    //exists function return objectId if user existed otherwise will return a null
    const existedUser = await User.exists({ email: req.body.email });
    console.log(existedUser);
    //if user is registered but the account was deleted which means the account is unavailable more
    // then they need to re-activate their accounts again
    if (existedUser && existedUser.available === 0)
      throw new Error("re-active");
    if (existedUser && existedUser.active === 0)
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
    const createdUser = await User.create({
      ...newUser,
      password: hashedPassword,
      activationCode: code
      //active account will be after verification process
    });
    //According to the role add user to the right schema
    if (createdUser.role === "patient") {
      const newPatient = await Patient.create({
        email: createdUser.email,
        //active account will be after verification process
      });
      if (createdUser.role === "doctor") {
        const newDoctor = await Doctor.create({
          email: createdUser.email,
          //active account will be after verification process
        });
      }
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
async function verifyAccount(req, res, nex) {
  const { email, code } = req.body
  console.log(email, code)
  //user will attach the code with their email then we check if match then user account will be activated
    try{
      const user = await User.findOne({
        email: email
      })
      console.log(user)
      if(!user) throw new Error("invalid")
      if (user.activationCode !== code)
        res.status(400).json({ message: "invalid activation code" });
      //user existed and code is right ==> we need to set account as active and save data
      user.active = 1
      await user.save()
      res.status(200).json({ message: "Account activated, login please to complete your information"})
    } catch(err) {
    }
}
export default {
  getUsersList,
  register,
  login,
  verifyAccount
};
