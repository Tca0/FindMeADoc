import express from "express";
import userController from "../controllers/userController.js";
import patientController from "../controllers/patientController.js"
import doctorController from "../controllers/doctorController.js"
import reviewController from "../controllers/reviewController.js"
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

router.route("/patients")
  .get(patientController.findPatients)
  .post(patientController.createPatient)

  router.route("/patients/:patientID")
  .get(patientController.showPatient)
  //! add auth
  .put(patientController.updatePatient)
  //! add auth
  .delete(patientController.removePatient)



router.route("/doctors")
  .get(doctorController.findDoctors)
  .post(doctorController.createDoctor)

router.route("/doctor/:doctorID")
  .get(doctorController.showDoctor)
  //! add auth
  .put(doctorController.updateDoctor)
  //! add auth
  .delete(doctorController.removeDoctor)

// doctor reviews
router.route("/doctor/:doctorID/reviews")
  .post(
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

export default router