import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import Patient from "../models/patient.js";
import Doctor from "../models/doctor.js";
import { validationResult } from "express-validator";
import user from "../models/user.js";
// get all users
async function getUsersList(req, res, next) {
  try {
    const users = await User.find();
    console.log(users)
    if(users.length === 0) throw new Error("empty DB")
    res.send(users);
  } catch (e) {
    next(e);
  }
}
async function registerNewUser(req, res, next) {
    // get email
    //verify if users already exist
    // if not added to the right document as well
    // activate the account
}
export default {
    getUsersList,
}