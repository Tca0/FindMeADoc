import { connectToDb, disconnectDb, dropDatabase } from './helpers.js'
import Doctor from "../models/doctor.js"
import Patient from "../models/patient.js"
import doctorData from "./data/doctor.js"
import patientData from "./data/patient.js"

async function seed(){
    console.log("About to connect to db.")
    await connectToDb()
    console.log("Database connected")

    await dropDatabase()

    console.log("Seeding data")
    const doctors = await Doctor.create(doctorData)
    console.log(`${doctors.length} doctors available`)

    const patients = await Patient.create(patientData)
    console.log(`${patients.length} patients available`)

    await disconnectDb()
    console.log("finished")
}

seed()