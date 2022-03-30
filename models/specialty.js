import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  specialties: [String],
});

export default mongoose.model("Specialty", userSchema);
