import express from 'express'
import CoursesController from '../controller/CoursesController.js'
import { jwtMiddleware } from '../middleware/jwtMiddlewere.js'


export const router = express.Router()


router.use(jwtMiddleware.jwtTokenIsValid)

// Get all courses
router.get('/', (req, res, next) => CoursesController.getAllCourses(req, res, next))

// Get a single course by ID
router.get('/:id', (req, res, next) => CoursesController.getCourseById(req, res, next))
