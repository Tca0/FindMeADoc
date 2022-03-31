import jwt from "jsonwebtoken";
import User from "../models/user.js";
import Patient from "../models/patient.js";
import Doctor from "../models/doctor.js";
import { validationResult } from "express-validator";
import passwordsFunctions from "../db/helpers/passwordsFunctions.js";
import mailer from "../db/helpers/mailer.js";
// get all users
async function getUsersList(req, res, next) {
  const { currentUser } = body.req;
  try {
    if (currentUser.role !== "admin") throw new Error("no-authentication");
    const users = await User.find({ active: 1 });
    console.log(users);
    if (users.length === 0) throw new Error("empty DB");
    res.send(users);
  } catch (err) {
    next(err);
  }
}
//register new account send email with link to confirm the registration and activate the account.
async function register(req, res, next) {
  try {
    const errors = validationResult(req);
    if (errors.errors.length !== 0) throw new Error(errors.errors[0].msg);
    //exists function return objectId if user existed otherwise will return a null
    const existedUser = await User.findOne({ email: req.body.email });
    //if user is registered but the account was deleted which means the account is unavailable more
    // then they need to re-activate their accounts again
    console.log(existedUser);
    if (existedUser && existedUser.accountDeleted)
      throw new Error("Account deleted");
    if (existedUser && !existedUser.active) throw new Error("Not active");
    if (existedUser) throw new Error("user existed");
    if (
      !passwordsFunctions.confirmPassword(
        req.body.password,
        req.body.confirmPassword
      )
    ) {
      throw new Error("password not confirmed");
    }
    const newUser = {
      email: req.body.email,
      password: req.body.password,
    };
    req.body.role ? (newUser.role = req.body.role) : "";
    console.log(newUser);
    //hashing password
    const hashedPassword = await passwordsFunctions.hashPassword(
      newUser.password
    );
    console.log(hashedPassword);
    const code = Math.floor(100000 + Math.random() * 900000); //Generate random 6 digit code.
    const expiry = Date.now() + 60 * 1000 * 15; // expire after 15 mins
    //try to send email for user
    // if succeed creat user other wise ask them to register with real email address
    console.log(code, expiry);
    const createdUser = await User.create({
      ...newUser,
      password: hashedPassword,
      verifyCode: code,
      verifyAccountExpires: expiry,
      //active account will be after verification process
    });
    const payload = {
      userId: createdUser._id,
      email: createdUser.email,
      role: createdUser.role,
      code: code,
    };
    console.log("payload", payload);
    const token = jwt.sign(payload, process.env.JWT_SECRET);
    const info = await mailer.sendConfirmationEmail(newUser.email, token);
    if (info.err) throw new Error("verification email failed");
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
      token,
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
    if (user.accountDeleted) throw new Error("Account deleted");
    if (!user.active) throw new Error("Not active");
    //it will compare the entered password with the hashed one(remember that)
    const isItMatch = await passwordsFunctions.comparePassword(
      user.password,
      req.body.password
    );

    if (!isItMatch) throw new Error("invalid login");
    const loggedIinAt = Date.now();
    let payload = {};
    payload = {
      userId: user._id,
      email: user.email,
      role: user.role,
      loggedIinAt,
    };
    user.loggedIinAt.push(loggedIinAt);
    user.save();
    if (user.role === "patient") {
      const patient = await Patient.findOne({ email: user.email });
      (payload.patientID = patient._id), (payload.name = patient.fullName);
    } else if (user.role === "doctor") {
      const doctor = await Doctor.findOne({ email: user.email });
      payload.doctorID = doctor._id;
      payload.name = doctor.fullName;
    }
    //creating a variable to cary logged in user (necessary info for user)
    console.log(payload);
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });
    res.status(200).json({ message: "Login success", token });
  } catch (err) {
    console.log("there is error");
    next(err);
  }
}
//verify account will check if the correct user is requesting the confirmation process
//if the link expired it will send new activation link to the user.
async function verifyAccount(req, res, next) {
  const { token } = req.params;
  console.log("token", token, typeof token);
  //user will attach the code with their email then we check if match then user account will be activated
  try {
    //decode token and search for user
    //if user existed and token not expired activate account
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    console.log("decodedToken", decodedToken);
    const user = await User.findOne({
      _id: decodedToken.userId,
    });
    console.log("user", user);
    if (!user) throw new Error("user not found");
    if (user.active) throw new Error("already activated");
    console.log(user.verifyCode, typeof user.verifyCode);
    console.log(decodedToken.code, typeof `${decodedToken.code}`);
    if (user.verifyCode !== `${decodedToken.code}`)
      throw new Error("wrong code");
    //check if link is expired
    const expiredLink = await User.findOne({
      _id: decodedToken.userId,
      verifyAccountExpires: { $gt: Date.now() },
    });
    if (!expiredLink) {
      const code = Math.floor(100000 + Math.random() * 900000); //Generate random 6 digit code.
      const expiry = Date.now() + 60 * 1000 * 15; // expire after 15 mins
      decodedToken.code = code;
      console.log(decodedToken);
      const newToken = jwt.sign(decodedToken, process.env.JWT_SECRET);
      console.log(newToken);
      user.verifyCode = code;
      user.verifyAccountExpires = expiry;
      user.save();
      const info = mailer.sendConfirmationEmail(decodedToken.email, newToken);
      return res.status(401).json({
        message:
          "Activation link has expired, new activation email was sent to you, please check your email",
        decodedToken,
        newToken,
      });
    } else {
      user.verifyAccountExpires = null;
      user.active = 1;
      user.verifiedAt = Date.now();
      user.verifyCode = null;
      await user.save();
      res.status(200).json({
        message: "Account activated, login please to complete your information",
      });
    }
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
  const { userId } = req.params;
  const { currentUser } = req;
  const errors = validationResult(req);
  try {
    if (errors.errors.length !== 0) throw new Error(errors.errors[0].msg);
    if (userId !== currentUser.userId) throw new Error("no-authentication");
    const userToChangePassword = await User.findById(currentUser.userId);
    console.log(
      "this user is requesting change password and approved by token",
      userToChangePassword
    );
    //compare the old password that entered with thw one that stored in DB
    const isItMatch = await passwordsFunctions.comparePassword(
      userToChangePassword.password,
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
    req.currentUser.password = password;
    console.log("new password", currentUser.password);
    await newUser.save();
    console.log("new user", newUser);
    const isRight = await passwordsFunctions.comparePassword(
      newUser.password,
      oldPassword
    );
    console.log("is working after change", isRight);
    res.status(200).json({ message: "password has been changed" });
  } catch (err) {
    next(err);
  }
}
//forgot password request will send a link to reset password for user if they are existed in DB
//the link will have all needed info about the account with expiry time
async function forgotPassword(req, res, next) {
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
      email: user.email,
      userId: user._id,
      role: user.role,
      code: code,
    };
    console.log(payload, "payload");
    const token = jwt.sign(payload, process.env.JWT_SECRET);
    console.log(token);
    //trying to store the value of sending male value in a variable but undefined
    const info = await mailer.sendResetPasswordEmail(email, token);
    if (info.err) {
      throw new Error("reset link failed");
    }
    //update the requested user with reset password token and expiry time
    console.log(user.resetPasswordToken, user.resetPasswordExpires);
    console.log(
      "before updating",
      user.resetPasswordToken,
      user.resetPasswordExpires
    );
    const passwordToReset = await User.findOneAndUpdate(
      {
        email: email,
      },
      {
        resetPasswordToken: token,
        resetPasswordExpires: new Date(expiry),
      },
      { new: true }
    );
    console.log(passwordToReset);
    res.status(200).json({ message: "check your email please" });
  } catch (err) {
    next(err);
  }
}
async function resetPassword(req, res, next) {
  const { password, confirmPassword } = req.body;
  console.log(password, confirmPassword);
  const { token } = req.params;
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  console.log("decoded token", decodedToken);
  const errors = validationResult(req);
  try {
    console.log(errors.errors[0]);
    if (errors.errors.length !== 0) throw new Error(errors.errors[0].msg);
    //test if code is valid
    // all steps that use code to reset and verify will change by converting codes to tokens
    const isItMatch = passwordsFunctions.confirmPassword(
      password,
      confirmPassword
    );
    if (!isItMatch) throw new Error("password not confirmed");
    // find the user from the token
    const user = await User.findOne({ email: decodedToken.email });
    if (!user) throw new Error("no-authentication");
    console.log("founded", user);
    // check if the user has the token to reset password
    if (user.resetPasswordToken !== token) throw new Error("No request");
    //check if token not expired
    const expiredLink = await User.findOne({
      _email: user.email,
      resetPasswordExpires: { $gt: Date.now() },
    });
    console.log("checking expired link", expiredLink);
    if (!expiredLink) throw new Error("reset password expired");
    // convert new password to hashed password
    // update document and save then return response.
    const hashedPassword = await passwordsFunctions.hashPassword(password);
    const newUser = await User.findOneAndUpdate(
      { _id: user._id },
      {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
      { new: true }
    );
    res.status(200).json({ message: "password has been reset, login again" });
  } catch (err) {
    next(err);
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
  resetPassword,
};
