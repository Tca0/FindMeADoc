import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  languages: [String],
});

export default mongoose.model("Language", userSchema);
