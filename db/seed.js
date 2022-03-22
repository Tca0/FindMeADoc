import { connectToDb, disconnectDb, dropDatabase } from './helpers.js'
import Doctor from "../models/doctor.js"
// import User from "../models/user.js"
import doctorData from "./data/doctor.js"
// import userData from "../data/user.js"

async function seed(){
    console.log("About to connect to db.")
    await connectToDb()
    console.log("Database connected")

    await dropDatabase()

    console.log("Seeding data")
    const doctors = Doctor.create(doctorData)
    console.log(`${doctors.length} doctors available`)

    // const users = User.create(userData)
    // console.log(`${users.length} users available`)

    await disconnectDb()
    console.log("finished")
}

seed()