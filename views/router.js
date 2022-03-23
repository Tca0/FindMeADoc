import express from "express";
import userController from "../controllers/userController.js";
// import patientController from "../controllers/patientController.js"
import doctorController from "../controllers/doctorController.js"
// import reviewController from "../controllers/reviewController.js"
// import auth from "../middleware/auth.js"
import { check } from "express-validator";

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).send("API running");
});
// get users, register, login routs
router.route("/users").get(userController.getUsersList);
router.route("/users/register").post(userController.register);
router
  .route("/users/login")
  .post([check("email", "Should be an email").isEmail()], userController.login
  );
router
  .route("/users/verifyAccount")
  .patch(userController.verifyAccount);

// patients
//! add auth
// router.route("/users/:patientID")
//   .get(patientController.search)
//   .put(patientController.update)
//   .delete(patientController.remove)

// doctors
router.get("/", (req, res) => {
  res.status(200).send("API Running")
})

router.route("/doctors")
  .get(doctorController.findDoctors)
  .post(doctorController.createDoctor)

//! add auth
router.route("/doctor/:doctorID")
  .get(doctorController.showDoctor)
  .put(doctorController.updateDoctor)
  .delete(doctorController.removeDoctor)

// doctor reviews
// router.route("/:doctorID/reviews")
//   .post(
//     auth,
//     [
//       check("comments", "Comments are missing").notEmpty(),
//       check("rating", "Please provide rating").notEmpty(),
//       check("rating", "Has to be an integer").isInt(),
//     ],
//     reviewController.create
//   );

// router
//   .route("/:doctorID/reviews/:reviewID")
//   .put(auth, commentController.update)
//   .delete(auth, commentController.remove);

export default router