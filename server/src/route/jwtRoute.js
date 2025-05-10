/**
 * Routes for the JWT.
 */
import express from 'express'
import { jwtController } from '../controller/jwtController.js'
import { jwtMiddleware } from '../middleware/jwtMiddlewere.js'

export const router = express.Router()

//router.post('/jwt/init', jwtController.init)
router.get('/list', jwtController.list)
router.post('/register', jwtController.register)
router.post('/login', jwtController.login)
router.get('/token', jwtMiddleware.jwtTokenIsValid, jwtController.token)
