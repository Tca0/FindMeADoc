import mongoose from "mongoose";
const addressSchema = new mongoose.Schema({
  addressLine1: { type: String, maxLength: 255, lowercase: true, trim: true },
  addressLine1: { type: String, maxLength: 255, lowercase: true, trim: true },
  town: { type: String, maxLength: 35, lowercase: true, trim: true },
  country: { type: String, maxLength: 35, lowercase: true, trim: true },
  postcode: { type: String, maxLength: 8, lowercase: true, trim: true },
  enteredDate: { type: Date, default: Date.now },
});
const phoneNumberSchema = new mongoose.Schema({
  contactNumber: { type: Number },
});
const specialtySchema = new mongoose.Schema({
  //specialty can't be unique otherwise we can't add another doctor with same specialty
  specialty: { type: String, lowercase: true, trim: true },
});
const languagesSchema = new mongoose.Schema({
  language: { type: String, lowercase: true, trim: true },
});
//for now each user can do one rating and 1 comment
const reviewSchema = new mongoose.Schema({
  rate: { type: Number },
  comment: { type: String, trim: true, maxLength: 450 },
  user: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});
const doctorSchema = new mongoose.Schema({
  firstName: { type: String, lowercase: true, trim: true },
  secondName: { type: String, lowercase: true, trim: true },
  fullName: { type: String, toLowerCase: true },
  email: { type: String, unique: true, lowercase: true, required: true },
  specialties: [specialtySchema],
  DOB: { type: Date, default: Date.now },
  gender: { type: String, enum: ["male", "female", "other"], lowercase: true, trim: true },
  contactDetails: [phoneNumberSchema],
  address: [addressSchema],
  registerAt: { type: Date, default: Date.now },
  languages: [languagesSchema],
  reviews: [reviewSchema],
  // boolean value to decide if account is active or not
  //by default is un-active
  active: {type: Boolean, default: 0 },
  completed: { type: Boolean, default: 0 }
  //profile pic url
  //profilePic: { type:string }
});

export default mongoose.model("Doctor", doctorSchema);
