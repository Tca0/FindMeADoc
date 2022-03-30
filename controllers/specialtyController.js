import Specialty from "../models/specialty.js";

// async function findSpecialties(req, res, next) {
//   try {
//     const specialties = await Specialty.find();
//     res.send(specialties);
//   } catch (e) {
//     res.send({ message: "There was a problem finding specialties" });
//   }
// }

export default { findSpecialties };
