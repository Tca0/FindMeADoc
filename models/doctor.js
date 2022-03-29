import mongoose from "mongoose";
const addressSchema = new mongoose.Schema({
  addressLine1: { type: String, maxLength: 255, lowercase: true, trim: true },
  addressLine2: { type: String, maxLength: 255, lowercase: true, trim: true },
  town: { type: String, maxLength: 35, lowercase: true, trim: true },
  country: { type: String, maxLength: 35, lowercase: true, trim: true },
  postcode: { type: String, maxLength: 8, lowercase: true, trim: true },
  enteredDate: { type: Date, default: Date.now },
});

//for now each user can do one rating and 1 comment
const reviewSchema = new mongoose.Schema({
  rate: { type: Number },
  comment: { type: String, trim: true, maxLength: 450 },
  user: { type: mongoose.Schema.ObjectId, ref: "Patient", required: true },
  createdAt: { type: Date, default: Date.now },
});
const doctorSchema = new mongoose.Schema({
  firstName: { type: String, lowercase: true, trim: true },
  secondName: { type: String, lowercase: true, trim: true },
  fullName: { type: String, toLowerCase: true },
  email: { type: String, unique: true, lowercase: true, required: true },
  specialties: [{ type: String }],
  DOB: { type: Date, default: Date.now },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
    lowercase: true,
    trim: true,
  },
  contactNumber: { type: Number },
  address: [addressSchema],
  registerAt: { type: Date, default: Date.now },
  languages: [{ type: String }],
  reviews: [reviewSchema],
  completed: { type: Boolean, default: 0 },
  completedAt: {type: Date, default: null},
  //profile pic url
  //profilePic: { type:string }
  about: { type: String },
  experience: { type: Number },
});

export default mongoose.model("Doctor", doctorSchema);
