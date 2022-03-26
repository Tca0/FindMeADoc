import bcrypt from "bcrypt";

async function hashPassword(password) {
    const salt = await bcrypt.genSalt(8);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword
}
async function comparePassword(hashedPassword, password) {
const passwordsMatch = await bcrypt.compare(password, hashedPassword);
console.log(passwordsMatch)
return passwordsMatch;
}

function confirmPassword(password, confirm) {
    return (password === confirm) ? true : false
}
export default {
  comparePassword,
  confirmPassword,
  hashPassword,
};
