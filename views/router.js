import express from "express";
import userController from "../controllers/userController.js";
import { check } from "express-validator";
import auth from "../middleware/auth.js";
const router = express.Router();
router.get("/", (req, res) => {
  res.status(200).send("API running");
});
// get users, register, login and verifyAccount routs
router.route("/users").get(userController.getUsersList);
router.route("/users/register").post(userController.register);
router.route("/users/login").post([check("email", "Should be an email").isEmail()],userController.login)
router.route("/users/verifyAccount").patch(userController.verifyAccount)
router.route("/users/changePassword").patch(auth, userController.changePassword);

export default router