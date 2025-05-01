import mongoose, {Schema} from 'mongoose'

const postSchema = new Schema({
    userId:{
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'users' 
    },
    content: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'draft',
        enum: ['draft', 'published', 'archived']
    },
    likes: {
        type: Number,
        default: 0
    },
    dislikes: {
        type: Number,
        default: 0
    }
  });


export default mongoose.model('posts', postSchema)