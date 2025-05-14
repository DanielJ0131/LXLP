import express from 'express'
import CommentsController from '../controller/CommentsController.js'
import { jwtMiddleware } from '../middleware/jwtMiddlewere.js'

export const router = express.Router()

router.use(jwtMiddleware.jwtTokenIsValid)

router.get('/', (req, res, next) => CommentsController.getAllComments(req, res, next))
router.get('/:id', (req, res, next) => CommentsController.getCommentById(req, res, next))
router.get('/by-post-id/:postId', CommentsController.getCommentsByPostId);
router.put('/:id', (req, res, next) => CommentsController.updateComment(req, res, next))
router.delete('/:id', (req, res, next) => CommentsController.deleteComment(req, res, next))
router.post('/', (req, res, next) => CommentsController.createComment(req, res, next))
