import mongoose, {Schema} from 'mongoose'

const userSchema = new Schema({

        username: {
            required: true,
            type: String,
            unique: true,
            trim: true,
            lowercase: true,
        },
        firstname: {
            required: true,
            type: String,
        },
        lastname:{
            required: true,
            type: String,
        },
        email: {
            required: true,
            type: String,
            unique: true,
        },
        password: {
            required: true,
            type: String,
        },
        Image: {
            type: String,
            default: 'https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-Clipart.png',
        },
        role: {
            type: String,
            enum: ['admin', 'user'],
            default: 'user',
        },
      });

export default mongoose.model('users', userSchema)