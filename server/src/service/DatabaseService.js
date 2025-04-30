import mongoose, {Schema} from 'mongoose'
import { config } from '../config/database.js'
import UserSchema from '../schemas/userSchema.js'

/**
 * Service (singleton) to manage database operations.
 *
 * @class
 */
class DatabaseService {
  #db = null
  userSchema = null
  postSchema = null
  commentSchema = null
  users = null
  posts = null
  comments = null

  async connect() {
    console.log('Trying to Connect to Database...');
    try {
      this.#db = await mongoose.connect(config.url);
      console.log('MongoDB Connection Successful!');

      
      
      // Fill the post schema
      this.postScema = new Schema({
        userId:{$olid: String},
        content: String,
        status: String,
        likes: Number,
        dislikes: Number
      });
      // Fill the comment schema
      this.commentSchema = new Schema({
        postId: {$olid: String},
        userId: {$olid: String},
        content: String,
        likes: Number,
        dislikes: Number
      });

      // Use the collection with created schemas
      this.users = UserSchema
      this.posts = mongoose.model('posts', this.postSchema);
      this.comments = mongoose.model('comments', this.commentSchema);
    } catch (error) {
      console.log('Error with connection: ' + error);
    }
  }

  async closeConnection() {
    if (this.#db) {
      try {
        await mongoose.disconnect();
        console.log('Database connection terminated.');
        
      } catch (error) {
        console.log('Error while disconnecting: ' + error);
      }
    }
  }
}

export default new DatabaseService()
