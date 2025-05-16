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
     * Retrieves comments by post ID with user information.
     * 
     * @param {string} postId - The ID of the post whose comments to retrieve.
     * @returns {Promise<Array<Object>>} A promise that resolves to an array of comment objects with user info.
     */
    async getCommentsByPostId(postId) {
        try {
            return await DatabaseService.comments.aggregate([
                {
                    $match: {
                        postId: new mongoose.Types.ObjectId(postId)
                    }
                },
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
                        image: "$user.image",
                        username: "$user.username",
                        userId: "$user._id",
                        userFullName: { $concat: ["$user.firstname", " ", "$user.lastname"] },
                        userEmail: "$user.email"
                    }
                }
            ]);
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
            const commentFromDb = await DatabaseService.comments.aggregate([
                {
                    $match: {
                        _id: new mongoose.Types.ObjectId(newComment._id)
                    }
                },
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
                        image: "$user.image",
                        username: "$user.username",
                        userId: "$user._id",
                        userFullName: { $concat: ["$user.firstname", " ", "$user.lastname"] },
                        userEmail: "$user.email"
                    }
                }
            ]);
            return commentFromDb[0];
        } catch (error) {
            console.log(error);
            throw error;
        }
    }


}


export default new CommentsModel();