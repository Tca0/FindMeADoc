import Patient from "../models/patient.js"

//ALL DOCTORS
async function findPatients(req,res,next){
    try{
        const patients = await Patient.find()
        res.send(patients)
    }catch(e){
        res.send({message:"There was a problem finding patients"})
    }
}

async function createPatient(req,res,next){
    console.log("incoming")
    const newPatient = req.body
    console.log(newPatient)
    try{
        const patientFound = await Patient.findOne({ email: newPatient.email})
        if(patientFound){
            return res.status(400).json({message: `Patient with email ${newPatient.email} already exists`})
        }
        const createdPatient = await Patient.create(newPatient)
        res.status(201).json(createdPatient)
    }catch(e){
        next(e)
    }
}

//SINGLE DOCTOR
async function showPatient(req,res,next){
    const id = req.params.patientID
    try{
        const patient = await Patient.findById(id)
        if(!patient) return res.json({message:"patient not found"})
        res.status(200).json(patient)
    }catch(e){
        next(e)
    }
}

async function updatePatient(req,res,next){
    const id = req.params.patientID
    const patientUpdate = req.body
    console.log(id)
    console.log(req.currentUser.patientID === id)

    try{
        const updatedPatient = await Patient.findOne({_id:id})

        if(!updatedPatient) return res.json({message: "Patient not found by ID"})
        if(req.currentUser.role==="doctor") return res.json({message: "Doctors cannot edit patients profiles"})
        if(req.currentUser.patientID !== id) return res.json({message: `Unauthorized: You do not have permission to edit this profile`})
        updatedPatient.set(patientUpdate)
        await updatedPatient.save()

        res.status(201).json(updatedPatient)
    }catch(e){
        next(e)
    }
}

async function removePatient(req,res,next){
    const id = req.params.patientID
    try{
        if(req.currentUser.role==="doctor") return res.json({message: "Doctors cannot remove user profiles"})
        if(req.currentUser.patientID !== id) return res.json({message: `Unauthorized: You do not have permission to remove this profile`})
        const deletedPatient = await Patient.findByIdAndDelete(id)
        console.log(deletedPatient)
        if(!deletedPatient) return res.json({ message: "patient not found" })
        res.sendStatus(204)
    } catch(e){
        next(e)
    }


}

export default {
    findPatients,
    createPatient,
    showPatient,
    updatePatient,
    removePatient
}