import jwt from "jsonwebtoken"
import User from "../models/user.js"

export default async function auth(req, res, next) {
    console.log("req.body", req.body)
    console.log(req.headers.authorization)
    const rawToken = req.headers.authorization
    if (!rawToken) {
        return res.status(401).json({ message: "Unauthorized - No token provided"})
    }
    const token = rawToken.split("Bearer ")[1].trim()
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

        const user = await User.findOne({ email: decodedToken.email })

        if (!user) {
            return res.status(401).json({ message: "Unauthorized - User doesn't exist" })
        }
        req.currentUser = user
        next()
    } catch (e) {
        next(e)
    }
}