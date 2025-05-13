import express from 'express'
import CoursesController from '../controller/CoursesController.js'


export const router = express.Router()

// Get all courses
router.get('/', (req, res, next) => CoursesController.getAllCourses(req, res, next))

// Get a single course by ID
router.get('/:id', (req, res, next) => CoursesController.getCourseById(req, res, next))