export default function errorHandler(err, req, res, next) {
  console.log("error", err.message);
  if (err.message === "empty DB") {
    return res.status(404).json({ message: "No users registered" });
  }
  if (err.message === "re-active") {
    return res
      .status(404)
      .json({
        message: "Account was deleted, please re-activate your account",
      });
  }
  if (err.message === "profile not completed") {
    return res
      .status(400)
      .json({
        message: "User already existed, please complete your register info.",
      });
  }
  if (err.message === "user existed") {
    return res.status(400).json({ message: "User already registered" });
  }
  if (err.message.includes("invalid email")) {
    return res.status(405).json({ message: "please use a valid email format" });
  }

  if (err.name === "JsonWebTokenError") {
    return res.status(400).json({ message: "Could not verify JWT." })
  }

  //default error
  res.sendStatus(500)
}
