import mongoose, {Schema} from 'mongoose'

const userSchema = new Schema({
        name: String,
        email: String,
        password: String,
        Image: String,
        role: String,
      });

export default mongoose.model('users', userSchema)