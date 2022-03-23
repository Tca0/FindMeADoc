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
//will not be used once registration is implemented
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

//!add auth to check if it current user is the same as the one found
async function updatePatient(req,res,next){
    const id = req.params.patientID
    const patientUpdate = req.body

    try{
        const updatedPatient = await Patient.findOne({_id:id})

        if(!updatedPatient) return res.json({message: "Patient not found by ID"})

        updatedPatient.set(patientUpdate)
        await updatedPatient.save()

        res.status(201).json(updatedPatient)
    }catch(e){
        next(e)
    }
}

//!add auth to check if it current user is the same as the one found
async function removePatient(req,res,next){
    const id = req.params.patientID
    const deletedPatient = await Patient.findByIdAndDelete(id)

    console.log(deletedPatient)

    if(!deletedPatient) return res.json({ message: "patient not found" })
    res.sendStatus(204)
}

export default {
    findPatients,
    createPatient,
    showPatient,
    updatePatient,
    removePatient
}