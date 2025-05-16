import express from 'express'
import CommentsController from '../controller/CommentsController.js'
import { jwtMiddleware } from '../middleware/jwtMiddlewere.js'
import {checkRole} from '../middleware/roleMiddelwere.js'

export const router = express.Router()

router.use(jwtMiddleware.jwtTokenIsValid)

router.get('/', checkRole(["admin"]),CommentsController.getAllComments)
router.get('/:id', checkRole(["admin", "user"]), CommentsController.getCommentById)
router.get('/by-post-id/:postId', checkRole(["admin", "user"]),CommentsController.getCommentsByPostId);
router.put('/:id', checkRole(["admin", "user"]), CommentsController.updateComment)
router.delete('/:id', checkRole(["admin", "user"]),CommentsController.deleteComment)
router.post('/',  checkRole(["admin", "user"]),CommentsController.createComment)
