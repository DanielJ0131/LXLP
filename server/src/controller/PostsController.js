import PostsModel from "../model/PostsModel.js";
import UsersModel from "../model/UsersModel.js";


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
            //console.log(res.locals.jwt);
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


    /**
     * Update an existing post.
     *
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    async updatePost(req, res, next) {
        const id = req.params.id;
        const postBody = req.body;
        try{
          const currentPost = await PostsModel.getPostById(id);
          if (!currentPost) {
            return res.status(404).json({ message: "Post not found" });
          }
          const updatedPost = await PostsModel.updatePost(id, postBody);
          res.json(updatedPost);
        } catch (error) {
          next(error);
        }
    }


    /**
     * Delete a post.
     *
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    async deletePost(req, res, next) {
        const id = req.params.id;
        try {
          const result = await PostsModel.getPostById(id);
          if (!result) {
            return res.status(404).json({ message: "Post not found" });
          }
          PostsModel.deletePost(id);
          res.status(200).json({ 
            message: "Post deleted successfully",
            deletedPost: result
          });
        } catch (error) {
            next(error);
        }
    }

    /**
     * Create new post.
     *
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    async createPost(req, res, next) {
        try {
            const username = res.locals.jwt.username;
            const user = await UsersModel.getUserByUsername(username);
            const userId = user._id;
            console.log(userId);
            const postData = {
                userId: userId,
                content: req.body.content,
            };
            const newPost = await PostsModel.createPost(postData);
            res.status(201).json({
                message: 'User added successfully',
                newPost: newPost
            });
        } catch (error) {
            next(error)
            };
    }        
        

}


export default new PostsController();