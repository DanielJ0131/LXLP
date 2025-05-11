import express from 'express'
// import { router as apikeyRoute } from './apikeyRoute.js'
// import { router as jwtRoute } from './jwtRoute.js'
import { router as usersRoute } from './usersRoute.js'
import { router as postsRoute } from './postsRoute.js'
import { router as commentsRoute } from './commentsRoute.js'
import { router as jwtRoute } from './jwtRoute.js'
import { jwtMiddleware } from '../middleware/jwtMiddlewere.js'
//import { router as courseRoute } from './coursesRoute.js'


// This will be the main route connecting all the other routes
// once we have jwt, api and user database routes.

export const router = express.Router()

router.use('/api/jwt', jwtRoute)
//router.use(jwtMiddleware.jwtTokenIsValid)
router.use('/api/users', usersRoute)
router.use('/api/posts', postsRoute)
router.use('/api/comments', commentsRoute)
//router.use('/api/courses', courseRoute)
