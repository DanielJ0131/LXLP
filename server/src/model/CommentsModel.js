import DatabaseService from '../service/DatabaseService.js';

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
            const comments = await DatabaseService.comments.find({ "postId.$oid": postId });
            return comments;
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


}


export default new CommentsModel();