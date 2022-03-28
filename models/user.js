import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    maxLength: 50,
    lowercase: true,
    trim: true,
  },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["admin", "patient", "doctor"],
    default: "patient",
  },
  registeredAt: { type: Date, default: Date.now },
  active: { type: Boolean, default: 0 },
  verifyCode: { type: String },
  verifyAccountExpires: { type: Date, default: null },
  verifiedAt: { type: Date, default: null },
  loggedIinAt: [{ type: Date, default: null }],
  resetPasswordToken: { type: String, default: null },
  resetPasswordExpires: { type: Date, default: null },
  passwordResetAt: { type: Date, default: null },
  passwordChangedAt: {type: Date, default: null},
  accountDeleted: { type: Boolean, default:0}
});

export default mongoose.model("User", userSchema);
("2000-01-01");
