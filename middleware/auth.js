import jwt from "jsonwebtoken";
import User from "../models/user.js";
import Patient from "../models/patient.js"
export default async function auth(req, res, next) {
  const rawToken = req.headers.authorization;
  try {
    if (JSON.stringify(rawToken) === "{}") {
      return res.status(400).json({
        message: "No access, please login again to your account to get access",
      });
    }
    if (rawToken === "Bearer" || !rawToken || rawToken === "Bearer undefined") {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const token = rawToken.split(" ")[1].trim();
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decodedToken.email });
    if (!user) throw new Error("Not registered");
    // console.log("decoded token", decodedToken)
    req.currentUser = decodedToken
    // req.currentUser = decodedToken
    // console.log(req.currentUser)
    next();
  } catch (e) {
    console.log(e.message);
    next(e);
  }
}