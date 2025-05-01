import CommentsModel from "../model/CommentsModel.js";


/**
 * Controller to perform CRUD for the comments collection.
 *
 * @class
 */
class CommentsController {




    // !!!TODO add a method to add a post to the database!!!!





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