import DatabaseService from '../service/DatabaseService.js';

/**
 * The UsersModel class provides methods to interact with the users data in the database.
 */
class PostsModel{


    /**
     * Retrieves a single user from the database by its ID.
     * 
     * @param {string} searchId - The ID of the user to retrieve.
     * @returns {Promise<Object|null>} A promise that resolves to the user object if found, or null if not found.
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
            const posts = await DatabaseService.posts.find();
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
            const posts = await DatabaseService.posts.find({ "userId.$oid": userId });
            return posts;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}


export default new PostsModel();