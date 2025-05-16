import DatabaseService from '../service/DatabaseService.js';
import mongoose from 'mongoose';


/**
 * The PostsModel class provides methods to interact with the post data in the database.
 */
class PostsModel{


    // !!!!TODO add a method to add a new post to the database!!!!
    


    /**
     * Retrieves a single comment from the database by its ID.
     * 
     * @param {string} searchId - The ID of the post to retrieve.
     * @returns {Promise<Object|null>} A promise that resolves to the post object if found, or null if not found.
     */
    async getPostById(postId) {
        try {
            const post = await DatabaseService.posts.findById(postId);
            return post;
        } catch (error) {
            console.log(error);
            }
        
        }

    /**
     * Retrieves all posts from the database.
     * 
     * @returns {Promise<Array<Object>>} A promise that resolves to an array of post objects.
     */
    async getAllPosts() {
        try {
            const posts = await DatabaseService.posts.aggregate([
                {
                    $lookup: {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "user"
                    }
                },
                {
                    $unwind: "$user"
                },
                {
                    $project: {
                        _id: 1,
                        content: 1,
                        status: 1,
                        likes: 1,
                        dislikes: 1,
                        userId: "$user._id",
                        userFullName: { $concat: ["$user.firstname", " ", "$user.lastname"] },
                        userEmail: "$user.email"
                    }
                }
            ]);
            return posts
        } catch (error) {
            console.log(error)
            
        }
    }

    /**
     * Retrieves posts by user ID.
     * 
     * @param {string} userId - The ID of the user whose posts to retrieve.
     * @returns {Promise<Array<Object>>} A promise that resolves to an array of post objects.
     */
    async getPostsByUserId(userId) {
        try {
            const posts = await DatabaseService.posts.find({ userId: new mongoose.Types.ObjectId(userId) });
            return posts;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    /**
     * Updates an existing post in the database by its ID.
     * 
     * @param {string} id - The ID of the post to update.
     * @param {Object} updateData - The data to update the post with.
     * @returns {Promise<Object|null>} A promise that resolves to the updated post object if successful, or null if not found.
     */
    async updatePost(id, updateData) {
        try {
            const updatedPost = await DatabaseService.posts.findByIdAndUpdate(
              id,  
              { 
                $set: {
                    content: updateData.content,
                    status: updateData.status,
                    likes: updateData.likes,
                    dislikes: updateData.dislikes
                }
              },
              { 
                new: true,         // Return the updated document
                runValidators: true // Run schema validators
              }
            );
            return updatedPost;
          } catch(error) {
            console.log(error);
            throw error; 
          }
    }


    /**
     * Deletes a post from the database by its ID.
     * 
     * @param {string} id - The ID of the post to delete.
     * @returns {Promise<Object|null>} A promise that resolves to the deleted post object if successful, or null if not found.
     */
    async deletePost(id) {
        try{
            const deletedPost = await DatabaseService.posts.findByIdAndDelete(id);
            return deletedPost;
            
          }catch (error) {
            error.message = 'Error deleting post';
            error.status = 400;
            console.log(error);
            throw error; 
          }
    }

    /**
     * Creates a new post in the database.
     * 
     * @param {Object} postData - The data for the new post.
     * @returns {Promise<Object>} A promise that resolves to the created post object.
     */
    async createPost(postData) {
        try {
            
            const newPost = new DatabaseService.posts(postData);
            await newPost.save();
            return newPost;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}


export default new PostsModel();