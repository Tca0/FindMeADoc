export default function errorHandler(err, req, res, next) {
  console.log("error", err.message);
  if (err.message === "empty DB") {
    return res.status(404).json({ message: "No users registered" });
  }
  if (err.message === "not active") {
    return res.status(400).json({ message: "Activate your account please."})
  }
    if (err.message === "user existed") {
      return res.status(400).json({ message: "User already registered" });
    }
  if (err.message.includes("invalid email")) {
    return res.status(405).json({ message: "please use a valid email format" });
  }
  if(err.message === "password not confirmed") {
    return res.status(404).json({ message: "passwords doesn't match" })
  }
  if(err.message === "invalid login") {
    res.status(404).json({ message: "invalid login information"})
  }
  if(err.message === "invalid activation") {
    res.status(400).json({ message: "invalid activation code."})
  }
  if(err.message === "invalid old password") {
    res.status(400).json({message: "old password doesn't match"})
  }
}
