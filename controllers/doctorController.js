import Doctor from "../models/doctor.js"

//ALL DOCTORS
async function findDoctors(req,res,next){
    try{
        const doctors = await Doctor.find()
        res.send(doctors)
    }catch(e){
        res.send({message:"There was a problem finding doctors"})
    }
}
//will not be used once registration is implemented
async function createDoctor(req,res,next){
    console.log("route hit")
    const newDoctor = req.body
    try{
        const doctorFound = await Doctor.findOne({ email: newDoctor.email})
        if(doctorFound){
            return res.status(400).json({message: `Doctor with email ${newDoctor.email} already exists`})
        }
        const createdDoctor = await Doctor.create(newDoctor)
        res.status(201).json(createdDoctor)
    }catch(e){
        next(e)
    }
}

//SINGLE DOCTOR
async function showDoctor(req,res,next){
    const id = req.params.doctorID
    try{
        const doctor = await Doctor.findById(id)
        if(!doctor) return res.json({message:"doctor not found"})
        res.status(200).json(doctor)
    }catch(e){
        next(e)
    }
}

//!add auth to check if it current user is the same as the one found
async function updateDoctor(req,res,next){
    const id = req.params.doctorID
    const doctorUpdate = req.body

    try{
        const updatedDoctor = await Doctor.findOne({_id:id})

        if(!updatedDoctor) return res.json({message: "Doctor not found by ID"})

        updatedDoctor.set(doctorUpdate)
        await updatedDoctor.save()

        res.status(201).json(updatedDoctor)
    }catch(e){
        next(e)
    }
}

//!add auth to check if it current user is the same as the one found
async function removeDoctor(req,res,next){
    const id = req.params.doctorID
    const deletedDoctor = await Doctor.findByIdAndDelete(id)

    console.log(deletedDoctor)

    if(!deletedDoctor) return res.json({ message: "doctor not found" })
    res.sendStatus(204)
}

export default {
    findDoctors,
    createDoctor,
    showDoctor,
    updateDoctor,
    removeDoctor
}