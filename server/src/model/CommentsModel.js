import DatabaseService from '../service/DatabaseService.js';
import mongoose from 'mongoose';
 /**
 * The CommentsModel class provides methods to interact with the comment data in the database.
 */
class CommentsModel{


    /**
     * Retrieves a single comment from the database by its ID.
     * 
     * @param {string} searchId - The ID of the comment to retrieve.
     * @returns {Promise<Object|null>} A promise that resolves to the comment object if found, or null if not found.
     */
    async getCommentById(commentId) {
        try {
            const comment = await DatabaseService.comments.findById(commentId);
            return comment;
        } catch (error) {
            console.log(error);
            }
        
        }
    




    /**
     * Retrieves all comments from the database.
     * 
     * @returns {Promise<Array<Object>>} A promise that resolves to an array of comment objects.
     */
    async getAllComments() {
        try {
            const comments = await DatabaseService.comments.find();
            return comments
        } catch (error) {
            console.log(error)
            
        }
    }


    /**
     * Retrieves comments by post ID.
     * 
     * @param {string} postId - The ID of the post whose contain the comments to retrieve.
     * @returns {Promise<Array<Object>>} A promise that resolves to an array of comment objects.
     */
    async getCommentsByPostId(postId) {
        try {
            return await DatabaseService.comments.find({
                postId: new mongoose.Types.ObjectId(postId)
            });
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    /**
     * Updates an existing comment in the database by its ID.
     * 
     * @param {string} id - The ID of the comment to update.
     * @param {Object} updateData - The data to update the comment with.
     * @returns {Promise<Object|null>} A promise that resolves to the updated comment object if successful, or null if not found.
     */
    async updateComment(id, updateData) {
        try {
            const updatedComment = await DatabaseService.comments.findByIdAndUpdate(
              id,  
              { 
                $set: {
                    content: updateData.content,
                    likes: updateData.likes,
                    dislikes: updateData.dislikes
                }
              },
              { 
                new: true,         // Return the updated document
                runValidators: true // Run schema validators
              }
            );
            return updatedComment;
          } catch(error) {
            console.log(error);
            throw error; 
          }
    }


    /**
     * Deletes a comment from the database by its ID.
     * 
     * @param {string} id - The ID of the comment to delete.
     * @returns {Promise<Object|null>} A promise that resolves to the deleted comment object if successful, or null if not found.
     */
    async deleteComment(id) {
        try{
            const deletedComment = await DatabaseService.comments.findByIdAndDelete(id);
            return deletedComment;
            
          }catch (error) {
            error.message = 'Error deleting comment';
            error.status = 400;
            console.log(error);
            throw error; 
          }
    }

    /**
     * Creates a new comment in the database.
     * 
     * @param {Object} commentData - The data for the new comment.
     * @returns {Promise<Object>} A promise that resolves to the created comment object.
     */
    async createComment(commentData) {
        try {
            const newComment = new DatabaseService.comments(commentData);
            await newComment.save();
            return newComment;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }


}


export default new CommentsModel();