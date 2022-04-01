import Doctor from "../models/doctor.js";
import Patient from '../models/patient.js'

//ALL DOCTORS
async function findDoctors(req, res, next) {
  try {
    const doctors = await Doctor.find();
    res.send(doctors);
  } catch (e) {
    res.send({ message: "There was a problem finding doctors" });
  }
}
//will not be used once registration is implemented
async function createDoctor(req, res, next) {
  console.log("route hit");
  const newDoctor = req.body;
  try {
    const doctorFound = await Doctor.findOne({ email: newDoctor.email });
    if (doctorFound) {
      return res.status(400).json({
        message: `Doctor with email ${newDoctor.email} already exists`,
      });
    }
    const createdDoctor = await Doctor.create(newDoctor);
    res.status(201).json(createdDoctor);
  } catch (e) {
    next(e);
  }
}

//SINGLE DOCTOR
async function showDoctor(req, res, next) {
  const id = req.params.doctorID;
  try {
    const doctor = await Doctor.findById(id)
    .populate('reviews.user')
    console.log(doctor,"doctor")
    if (!doctor) return res.json({ message: "doctor not found" });
    res.status(200).json(doctor);
  } catch (e) {
    next(e);
  }
}

//!add auth to check if it current user is the same as the one found
async function updateDoctor(req, res, next) {
  const id = req.params.doctorID;
  const doctorUpdate = req.body;

  try {
    const updatedDoctor = await Doctor.findOne({ _id: id });

    if (!updatedDoctor) return res.json({ message: "Doctor not found by ID" });
    if (req.currentUser.role === "patient")
      return res.json({ message: "Patients cannot edit doctor profiles" });
    if (req.currentUser.doctorID !== id)
      return res.json({
        message: `Unauthorized: You do not have permission to edit this profile`,
      });

    updatedDoctor.set(doctorUpdate);
    await updatedDoctor.save();

    res.status(201).json(updatedDoctor);
  } catch (e) {
    next(e);
  }
}

//!add auth to check if it current user is the same as the one found
async function removeDoctor(req, res, next) {
  const id = req.params.doctorID;
  try {
    if (req.currentUser.role === "patient")
      return res.json({ message: "Patients cannot remove Doctor profiles" });
    if (req.currentUser.doctorID !== id)
      return res.json({
        message: `Unauthorized: You do not have permission to remove this profile`,
      });
    const deletedDoctor = await Doctor.findByIdAndDelete(id);

    console.log(deletedDoctor);

    if (!deletedDoctor) return res.json({ message: "doctor not found" });
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
}

// search doctors: for substring search, case insensitive
async function searchDoctors(req, res) {
  let { postcode, speciality, name, language } = req.query;
  const filters = {};
  if (postcode) {
    filters["address.postcode"] = new RegExp(postcode, "i");
  }
  if (speciality) {
    filters.specialties = new RegExp(speciality, "i");
  }
  if (name) {
    filters.fullName = new RegExp(name, "i");
  }
  if (language) {
    filters.languages = new RegExp(language, "i");
  }
  try {
    console.log(filters);
    const matchingDoctor = await Doctor.find(filters);
    if (matchingDoctor.length === 0) {
      return res.status(200).json({ message: "No matching result found." });
    }
    res.status(200).json(matchingDoctor);
  } catch (e) {
    res.send({ message: "There was a problem searching a doctor." });
  }
}

export default {
  findDoctors,
  createDoctor,
  showDoctor,
  updateDoctor,
  removeDoctor,
  searchDoctors,
};
