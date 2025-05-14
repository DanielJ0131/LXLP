import express from 'express'
import PostsController from '../controller/PostsController.js'
import { jwtMiddleware } from '../middleware/jwtMiddlewere.js'

export const router = express.Router()



// !!!!TODO add a new route to add a post to the database!!!!


router.use(jwtMiddleware.jwtTokenIsValid)

router.get('/', (req, res, next) => PostsController.getAllPosts(req, res, next))
router.get('/:id', (req, res, next) => PostsController.getPostById(req, res, next))
router.get('/by-user-id/:userId', PostsController.getPostsByUserId);
router.put('/:id', (req, res, next) => PostsController.updatePost(req, res, next))
router.delete('/:id', (req, res, next) => PostsController.deletePost(req, res, next))
