export default function errorHandler(err, req, res, next) {
  console.log("error", err.message, err);
  if (err.message.includes("no-authentication")) {
    return res.status(401).json({ message: "request is unauthorized" });
  }
  if (err.message === "empty DB") {
    return res.status(404).json({ message: "No users registered" });
  }
  if (err.message === "user existed" || err.message === "Doctor registered") {
    return res.status(409).json({ message: "User already registered" });
  }
  if (
    err.message.includes("invalid email") ||
    err.message === "Invalid email"
  ) {
    return res.status(405).json({ message: "please use a valid email format" });
  }
  if (err.message === "not registered") {
    return res
      .status(405)
      .json({ message: "Email address not registered in this website" });
  }
  if (err.message === "password not confirmed") {
    return res
      .status(404)
      .json({ message: "password and confirmed password don't match" });
  }
  if (err.message === "invalid login") {
    return res.status(404).json({ message: "invalid login information" });
  }
  if (err.message === "user not found") {
    return res.status(404).json({ message: "Email address not found" });
  }
  if (err.message === "invalid old password") {
    return res.status(404).json({ message: "old password doesn't match" });
  }
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ message: "Invalid access." });
  }
  if (err.message === "invalid password") {
    return res.status(400).json({message: "access denied, password doesn't match"})
  }
    if (err.message === "Not active") {
      return res.status(400).json({
        message:
          "Please verify your account to login, an email sent to you with verification code",
      });
    }

  if (err.message === "email required" || err.message === "empty filed") {
    return res.status(406).json({ message: "please enter your email address" });
  }
  if (err.message === "Invalid value") {
    return res.status(400).json({
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
    return res
      .status(500)
      .json({
        message:
          "couldn't verify email/send verification email, please try register with a valid email.",
      });
  }
  if (err.message === "reset link failed") {
    return res
      .status(405)
      .json({
        message: "couldn't sent reset password link please try again later",
      });
  }
  if (err.message === "link failed") {
    return res.status(405).json({ message: "failed to send email"})
  }
    if (
      err.message === "reset password expired" ||
      err.message === "No request"
    ) {
      return res
        .status(401)
        .json({ message: "link expired, request new link please" });
    }
  if (err.message === "wrong code") {
    return res.status(401).json({ message: "invalid activation code" });
  }
  if (err.message === "already activated") {
    return res.status(201).json({
      message: "account already activated, please login to your account",
    });
  }
  if (err.message === "Account deleted") {
    return res
      .status(404)
      .json({
        message:
          "Account deleted, please contact help center to reactivate your account or more details",
      });
  }
  //default error
  res.sendStatus(500);
}
