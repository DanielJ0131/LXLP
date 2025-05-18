import CommentsModel from "../model/CommentsModel.js"
import UsersModel from "../model/UsersModel.js"


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
            const commentId = req.params.id
            const comment = await CommentsModel.getCommentById(commentId)
            if (!comment) {
                return res.status(404).json({ message: 'Comment not found' })
            }

            res.status(200).json(comment)
        } catch (error) {
            next(error)
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
            const comments = await CommentsModel.getAllComments()
            res.status(200).json(comments)
        } catch (error) {
            next(error)
        }
    }



    /**
     * Get comments by post ID.
     *
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    async getCommentsByPostId(req, res, next) {
        try {
            const postId = req.params.postId
            const comments = await CommentsModel.getCommentsByPostId(postId)
            if (!comments || comments.length === 0) {
                return res.status(404).json({ message: 'No comments found for this post' })
            }
            res.status(200).json(comments)
        } catch (error) {
            next(error)
        }
    }


    /**
     * Update an existing comment.
     *
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    async updateComment(req, res, next) {
        const id = req.params.id
        const commetBody = req.body
        try{
            const currentComment = await CommentsModel.getCommentById(id)
            if (!currentComment) {
                return res.status(404).json({ message: "Comment not found" })
            }
            const updatedComment = await CommentsModel.updateComment(id, commetBody)
            res.json(updatedComment)
        } catch (error) {
            next(error)
        }
    }



    /**
     * Delete a comment.
     *
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    async deleteComment(req, res, next) {
        const id = req.params.id
        try {
            const result = await CommentsModel.getCommentById(id)
            if (!result) {
                return res.status(404).json({ message: "Comment not found" })
            }
            CommentsModel.deleteComment(id)
            res.status(200).json({
                message: "Comment deleted successfully",
                deletedComment: result
            })
        } catch (error) {
            next(error)
        }
    }


    /**
     * Create new comment.
     *
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    async createComment(req, res, next) {
        try {
            const username = res.locals.jwt.username
            const user = await UsersModel.getUserByUsername(username)
            const userId = user._id
            const commentData = {
                userId: userId,
                postId: req.body.postId,
                content: req.body.content
            }
            const newComment = await CommentsModel.createComment(commentData)
            res.status(201).json({
                message: 'Comment added successfully',
                newComment: newComment
            })
        } catch (error) {
            next(error)
        };
    }
}


export default new CommentsController()
