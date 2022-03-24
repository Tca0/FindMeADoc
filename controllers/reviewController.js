import { validationResult } from "express-validator";
import Doctor from "../models/doctor.js"

async function create(req, res, next){
    // const errors = validationResult(req)
    // console.log(errors)
    // console.log(Object.keys(errors))
    // console.log("Number of errors", errors.errors.length)
    // if (!errors.isEmpty()) {
    //     return res.status(400).json({ errors: errors.array() })
    // }
    const {body: newReview} = req
    const doctorID = req.params.doctorID
    try{
        const reviewsOnDoctor = await Doctor.findById(doctorID)

        reviewsOnDoctor.reviews.push(newReview)
        console.log({newReview})

        const updatedDoctor = await reviewsOnDoctor.save()
        return res.status(200).json(updatedDoctor)
    }catch(e){
        next(e)
    }
}

async function update(req, res, next){
    //!need to add auth
    const {doctorID, reviewID} = req.params
    console.log(doctorID,reviewID)
    console.log(req.body)

    try{
        const doctor = await Doctor.findById(doctorID)

        if(!doctor){
            return res.status(404).send({message: `Doctor with ${doctorID} not found`})
        }

        const review = doctor.reviews.id(reviewID)
        
        if(!review){
            return res.status(404).send({message: `Review with ${reviewID} not found`})
        }

        //!check validation via email

        review.set(req.body)

        const updatedDoctor = await doctor.save()
        return res.status(200).json(updatedDoctor)
    }catch(e){
        next(e)
    }
}

async function remove(req, res, next){
    //!need to add auth
    const {doctorID, reviewID} = req.params
    console.log(doctorID,reviewID)
    console.log(req.body)

    try{
        const doctor = await Doctor.findById(doctorID)

        if(!doctor){
            return res.status(404).send({message: `Doctor with ${doctorID} not found`})
        }

        const review = doctor.reviews.id(reviewID)
        
        if(!review){
            return res.status(404).send({message: `Review with ${reviewID} not found`})
        }

        //!check validation via email

        review.remove()

        const updatedDoctor = await doctor.save()
        return res.status(200).json(updatedDoctor)
    }catch(e){
        next(e)
    }
}

export default {
    create,
    update,
    remove
}