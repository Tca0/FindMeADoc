import express from "express";
import userController from "../controllers/userController.js";
import patientController from "../controllers/patientController.js";
import doctorController from "../controllers/doctorController.js";
import reviewController from "../controllers/reviewController.js";
import { check } from "express-validator";
import auth from "../middleware/auth.js";
const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).send("API Running");
});
// get users, register, login and verifyAccount routs
router.route("/users").get(auth, userController.getUsersList);
router.route("/users/register").post(
    [
      check("email").exists(),
      check("email", "email required").notEmpty(),
      check("email", "Invalid email").isEmail(),
      check("password").exists(),
      check("password", "password required").notEmpty(),
      check("confirmPassword").exists(),
      check("confirmPassword", "confirmPassword required").notEmpty(),
    ],
    userController.register
  );
router.route("/users/login").post(
    [
      check("email", "empty filed").exists(),
      check("email", "email required").notEmpty(),
      check("email", "Invalid email").isEmail(),
      check("password", "empty password").exists(),
      check("password", "password required").notEmpty(),
    ],
    userController.login
  );
router.route("/users/verifyAccount").patch(userController.verifyAccount);
router.route("/users/:userId/changePassword").patch(auth,
    [
      check("oldPassword", "empty filed").exists(),
      check("oldPassword").notEmpty(),
      check("newPassword", "empty filed").exists(),
      check("newPassword").notEmpty(),
      check("confirmPassword", "empty filed").exists(),
      check("confirmPassword").notEmpty(),
    ],
    userController.changePassword
  );
router.route("/users/forgotPassword").put(
    [
      check("email", "empty filed").exists(),
      check("email", "Invalid email").isEmail(),
    ],
    userController.forgotPassword
  );
router
  .route("/users/resetPassword/:token")
  .patch(
    [
      check("newPassword").exists(),
      check("newPassword").notEmpty(),
      check("confirmPassword").exists(),
      check("confirmPassword").notEmpty(),
    ],
    userController.resetPassword
  );
// doctors

router
  .route("/patients")
  .get(patientController.findPatients)
  .post(patientController.createPatient);

router
  .route("/patients/:patientID")
  .get(patientController.showPatient)
  //! add auth
  .put(patientController.updatePatient)
  //! add auth
  .delete(patientController.removePatient);

router
  .route("/doctors")
  .get(doctorController.findDoctors)
  .post(doctorController.createDoctor);

router
  .route("/doctor/:doctorID")
  .get(doctorController.showDoctor)
  //! add auth
  .put(doctorController.updateDoctor)
  //! add auth
  .delete(doctorController.removeDoctor);

// doctor reviews
router.route("/doctor/:doctorID/reviews").post(
  //     auth,
  // [
  //   check("comments", "Comments are missing").notEmpty(),
  //   check("rating", "Please provide rating").notEmpty(),
  //   check("rating", "Has to be an integer").isInt(),
  // ],
  reviewController.create
);

//!add auth
router
  .route("/doctor/:doctorID/review/:reviewID")
  .put(reviewController.update)
  .delete(reviewController.remove);

export default router;
