import Language from "../models/language.js";

async function findLanguages(req, res, next) {
  try {
    const languages = await Language.find();
    res.send(languages);
  } catch (e) {
    res.send({ message: "There was a problem finding languages" });
  }
}

export default { findLanguages };
