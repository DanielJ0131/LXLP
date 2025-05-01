import express from 'express'
import CommentsController from '../controller/CommentsController.js'

export const router = express.Router()



router.get('/', (req, res, next) => CommentsController.getAllComments(req, res, next))