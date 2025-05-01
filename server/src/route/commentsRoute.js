import express from 'express'
import CommentsController from '../controller/CommentsController.js'

export const router = express.Router()



router.get('/', (req, res, next) => CommentsController.getAllComments(req, res, next))
router.get('/:id', (req, res, next) => CommentsController.getCommentById(req, res, next))
router.get('/by-post-id/:postId', CommentsController.getCommentsByPostId);