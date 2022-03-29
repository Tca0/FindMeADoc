import mongoose from "mongoose";
const addressSchema = new mongoose.Schema({
  addressLine1: { type: String, maxLength: 255, lowercase: true, trim: true },
  addressLine2: { type: String, maxLength: 255, lowercase: true, trim: true },
  town: { type: String, maxLength: 35, lowercase: true, trim: true },
  country: { type: String, maxLength: 35, lowercase: true, trim: true },
  postcode: { type: String, maxLength: 8, lowercase: true, trim: true },
  enteredDate: { type: Date, default: Date.now },
});
const patientSchema = new mongoose.Schema({
  firstName: { type: String, trim: true },
  secondName: { type: String, trim: true },
  fullName: { type: String, toLowerCase: true },
  DOB: { type: Date },
  gender: {
    type: String,
    enum: ["male", "female", "other"],
    lowercase: true,
    trim: true,
  },
  address: addressSchema,
  registerAt: { type: Date, default: Date.now },
  phone: { type: Number },
  email: { type: String, unique: true, lowercase: true, required: true },
  completedAt: { type: Date, default: null },
  completed: { type: Boolean, default: 0 },
  //profile pic url
  //profilePic: { type:string }
});

export default mongoose.model("Patient", patientSchema);
