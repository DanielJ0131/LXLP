import PostsModel from "../model/PostsModel.js";


/**
 * Controller to perform CRUD for the posts collection.
 *
 * @class
 */
class PostsController {
    /**
     * Get a post by ID.
     *
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    async getPostById(req, res, next) {
        try {
            const postId = req.params.id;
            const post = await PostsModel.getPostById(postId);
            if (!post) {
                return res.status(404).json({ message: 'Post not found' });
            }

            res.status(200).json(post);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get all posts.
     *
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    async getAllPosts(req, res, next) {
        try {
            const posts = await PostsModel.getAllPosts();
            res.status(200).json(posts);
        } catch (error) {
            next(error);
        }
    }

    /**
     * Get posts by user ID.
     *
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    async getPostsByUserId(req, res, next) {
        try {
            const userId = req.params.userId;
            const posts = await PostsModel.getPostsByUserId(userId);
            if (!posts || posts.length === 0) {
                return res.status(404).json({ message: 'No posts found for this user' });
            }
            res.status(200).json(posts);
        } catch (error) {
            next(error);
        }
    }




}


export default new PostsController();