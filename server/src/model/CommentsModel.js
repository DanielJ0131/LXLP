import DatabaseService from '../service/DatabaseService.js';

/**
 * The CommentsModel class provides methods to interact with the comment data in the database.
 */
class CommentsModel{



    




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


}


export default new CommentsModel();