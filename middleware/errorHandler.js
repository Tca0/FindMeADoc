export default function errorHandler(err, req, res, next) {
    console.log(err.message)
    if(err.message === "empty DB") {
        return res.status(404).json({ message: "No users registered"})
    }
}