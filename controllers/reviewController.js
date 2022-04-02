import { validationResult } from "express-validator";
import Doctor from "../models/doctor.js";

async function create(req, res, next) {
  // validation
  const errors = validationResult(req);
  console.log(errors);
  console.log(Object.keys(errors));
  console.log("Number of errors", errors.errors.length);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { body: newReview } = req;
  console.log(req.currentUser)
  newReview.user = req.currentUser.patientID;
  console.log("newReviw")
  console.log(newReview)
  const doctorID = req.params.doctorID;

  try {
    const reviewsOnDoctor = await Doctor.findById(doctorID);
    if (!reviewsOnDoctor) {
      return res.status(404).send({ message: `Doctor can't be found` });
    }
    if (req.currentUser.role === "doctor") {
      return res.status(404).send({ message: `You have to be a patient` });
    }
    reviewsOnDoctor.reviews.push(newReview);
    console.log({ newReview });
    const updatedDoctor = await reviewsOnDoctor.save();
    return res.status(200).json(updatedDoctor);
  } catch (e) {
    next(e);
  }
}

async function update(req, res, next) {
  const { doctorID, reviewID } = req.params;
  console.log(doctorID, reviewID);
  console.log(req.body);

  try {
    const doctor = await Doctor.findById(doctorID);

    if (!doctor) {
      return res
        .status(404)
        .send({ message: `Doctor with ${doctorID} not found` });
    }

    const review = doctor.reviews.id(reviewID);

    if (!review) {
      return res
        .status(404)
        .send({ message: `Review with ${reviewID} not found` });
    }

    if (req.currentUser.userId !== review.user.toString()) {
      return res
        .status(401)
        .send({ message: "Unauthorized - You didn't create that comment" });
    }

    review.set(req.body);

    const updatedDoctor = await doctor.save();
    return res.status(200).json(updatedDoctor);
  } catch (e) {
    next(e);
  }
}

async function remove(req, res, next) {
  console.log("got hit")
  const { doctorID, reviewID } = req.params;
  console.log(doctorID, reviewID);

  try {
    const doctor = await Doctor.findById(doctorID);

    if (!doctor) {
      return res
        .status(404)
        .send({ message: `Doctor with ${doctorID} not found` });
    }
    console.log(doctor)
    const review = doctor.reviews.id(reviewID);

    if (!review) {
      return res
        .status(404)
        .send({ message: `Review with ${reviewID} not found` });
    }

    if (req.currentUser.patientID !== review.user.toString()) {
      return res
        .status(401)
        .send({ message: "Unauthorized - You didn't create that comment" });
    }

    review.remove();

    const updatedDoctor = await doctor.save();
    return res.status(200).json(updatedDoctor);
  } catch (e) {
    next(e);
  }
}
async function getAllReviews(req, res, next) {
  const { doctorID } = req.params;
  console.log(doctorID);
  const doctor = await Doctor.findById(doctorID)
    .populate({
      path: "createdBy",
      select: "fullName",
      strictPopulate: false,
    })

  console.log("doctor",doctor)
  const reviews = doctor.reviews 
  console.log("reviews",reviews);

}

export default {
  create,
  update,
  remove,
  getAllReviews,
};
