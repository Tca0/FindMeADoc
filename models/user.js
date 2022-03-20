import mongoose from "mongoose";
import pkg from "validator";
const { isEmail } = pkg
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, maxLength: 50, lowercase: true, trim: true ,validate: [ isEmail, 'invalid email'] },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "patient", "doctor"], default: "patient" },
  registeredAt: { type: Date, default: Date.now },
  active: {type: Boolean, default: 0 },
  completed: { type: Boolean, default: 0 }
});

export default mongoose.model("User", userSchema);
