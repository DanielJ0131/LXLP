import mongoose, {Schema} from 'mongoose'


const commentSchema = new Schema({
    postId: {
            required: true,
            type: Schema.Types.ObjectId,
            ref: 'posts'
        },
        userId: {
            required: true,
            type: Schema.Types.ObjectId,
            ref: 'users' 
        },
        content: String,
        likes: {
            type: Number,
            default: 0
        },
        dislikes: {
            type: Number,
            default: 0
        },
      });


export default mongoose.model('comments', commentSchema)