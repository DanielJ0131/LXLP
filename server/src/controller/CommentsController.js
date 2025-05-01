import CommentsModel from "../model/CommentsModel.js";


/**
 * Controller to perform CRUD for the comments collection.
 *
 * @class
 */
class CommentsController {






    /**
     * Get a comment by ID.
     *
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    async getCommentById(req, res, next) {
        try {
            const commentId = req.params.id;
            const comment = await CommentsModel.getCommentById(commentId);
            if (!comment) {
                return res.status(404).json({ message: 'Comment not found' });
            }

            res.status(200).json(comment);
        } catch (error) {
            next(error);
        }
    }



    /**
     * Get all comments.
     *
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    async getAllComments(req, res, next) {
        try {
            const comments = await CommentsModel.getAllComments();
            res.status(200).json(comments);
        } catch (error) {
            next(error);
        }
    }



}


export default new CommentsController();