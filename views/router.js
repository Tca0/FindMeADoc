import express from "express";
import userController from "../controllers/userController.js";
const router = express.Router();
router.get("/", (req, res) => {
  res.status(200).send("API running");
});
// register new user
router.route("/users").get(userController.getUsersList);

export default router