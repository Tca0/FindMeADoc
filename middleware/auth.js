import jwt from "jsonwebtoken";
import User from "../models/user.js";

export default async function auth(req, res, next) {
  // console.log(req.headers.authorization);
  // Check the request for the token
  const rawToken = req.headers.authorization;
  // console.log(rawToken)
  try {
    //by adding try catch block no need to test if token existed or valid
    // console.log(rawToken)
    if (JSON.stringify(rawToken) === "{}") {
      return res.status(400).json({
        message: "No access, please login again to your account to get access",
      });
    }
    if (rawToken === "Bearer" || !rawToken || rawToken === "Bearer undefined") {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const token = rawToken.split(" ")[1].trim();
    console.log("token", token);
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    console.log("payload from decodedToken", decodedToken);
    const user = await User.findOne({ email: decodedToken.email });
    console.log(user);
    if (!user) throw new Error("Not registered");
    req.currentUser = user;
    next();
  } catch (e) {
    console.log(e.message);
    next(e);
  }
}