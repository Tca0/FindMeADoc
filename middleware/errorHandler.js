export default function errorHandler(err, req, res, next) {
  console.log("error", err.message);
  if (err.message.includes("no-authentication")) {
    return res.status(401).json({ message: "request is unauthorized" });
  }
    if (err.message === "empty DB") {
      return res.status(404).json({ message: "No users registered" });
    }
  if (err.message === "not active") {
    return res.status(400).json({ message: "Activate your account please."})
  }
    if (err.message === "user existed") {
      return res.status(409).json({ message: "User already registered" });
    }
  if (
    err.message.includes("invalid email") ||
    err.message === "Invalid email"
  ) {
    return res.status(405).json({ message: "please use a valid email format" });
  }
  if (err.message === "not registered") {
    return res.status(405).json({ message: "Email address not registered in this website" });
  }
    if (err.message === "password not confirmed") {
      return res
        .status(404)
        .json({ message: "password and confirmed password don't match" });
    }
  if(err.message === "invalid login") {
    res.status(404).json({ message: "invalid login information"})
  }
  if (err.message === "user not found") {
    res.status(404).json({ message: "Email address not found" });
  }
  if(err.message === "invalid old password") {
    res.status(404).json({message: "old password doesn't match"})
  }
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ message: "Invalid access." })
  }
  if (err.message === "Not active") {
    return res.status(425).json({message: "Please verify your account to login, an email sent to you with verification code"})
  }
  if (err.message === "email required" || err.message === "empty filed") {
    return res.status(406).json({ message: "please enter your email address" });
  }
  if (err.message === "Invalid value") {
    return res
      .status(400)
      .json({
        message: "empty fields, please complete your registration form",
      });
  }
  if (err.message === "password required" || err.message === "empty password") {
    return res.status(406).json({ message: "please enter your password" });
  }
  if (err.message === "confirmPassword required") {
    return res.status(406).json({ message: "please confirm your password" });
  }
  if (err.message === "verification email failed") {
    res.status(500).json({message: "couldn't verify email/send verification email, please try register with a valid email."})
  }
  if (err.message === "reset link failed") {
    res.status(405).json({message : "couldn't sent reset password link please try again later"})
  }
  if(err.message === "reset password expired") {
    return res.status(401).json({ message: "link expired, request new link please" });
  }
  if (err.message === "wrong code") {
    return res.status(401).json({ message: "invalid activation code"})
  }
  if (err.message === "already activated") {
    return res.status(201).json({
      message: "account already activated, please login to your account",
    });
  }
  if (err.message === "No request") {
    return res.status(401).json({ message: "The user didn't make a request to change password" });
  }
  if (err.message === "Account deleted") {
    return res.status(204).json({message: "Account deleted, please contact help center to reactivate your account or more details"})
  }
    //default error
    res.sendStatus(500);
}
