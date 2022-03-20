import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
//   userName: {
//     firstName: { type: String, required: true, lowercase: true, trim: true },
//     secondName: { type: String, required: true, lowercase: true, trim: true },
//   },
  email: { type: String, required: true, unique: true, maxLength: 50, lowercase: true },
  fullName: { type: String, unique: true, required: true, toLowerCase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "patient", "doctor"], default: "patient" },
  registeredAt: { type: Date, default: Date.now },
  active: {type: Boolean, default: 0 }
});

export default mongoose.model("User", userSchema);
