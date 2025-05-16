import express from 'express';
import UsersController from '../controller/UserController.js'
import { jwtMiddleware } from '../middleware/jwtMiddlewere.js';


export const router = express.Router()

router.use(jwtMiddleware.jwtTokenIsValid);


// Get the current user's profile
router.get('/profile', UsersController.getCurrentUserProfile);


