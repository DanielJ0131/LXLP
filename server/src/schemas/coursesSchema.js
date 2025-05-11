import mongoose, { Schema } from 'mongoose'

const courseSchema = new Schema({
    video: {
        type: String,
        required: true,
        trim: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
}, { timestamps: true })

export default mongoose.model('courses', courseSchema)
