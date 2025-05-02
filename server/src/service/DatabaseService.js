import mongoose, {Schema} from 'mongoose'
import { config } from '../config/database.js'
import UserSchema from '../schemas/userSchema.js'
import PostSchema from '../schemas/postSchema.js'
import CommentSchema from '../schemas/commentSchema.js'

/**
 * Service (singleton) to manage database operations.
 *
 * @class
 */
class DatabaseService {
  #db = null
  users = null
  posts = null
  comments = null

  async connect() {
    console.log('Trying to Connect to Database...');
    try {
      this.#db = await mongoose.connect(config.url);
      console.log('MongoDB Connection Successful!');

      

      // Use the collection with created schemas
      this.users = UserSchema
      this.posts = PostSchema;
      this.comments = CommentSchema;
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
