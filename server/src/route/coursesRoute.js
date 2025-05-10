import express from 'express'
import CoursesController from '../controller/CoursesController.js'

export const router = express.Router()

// Get all courses
router.get('/', (req, res, next) => CoursesController.getAllCourses(req, res, next))

// Get a single course by ID
router.get('/:id', (req, res, next) => CoursesController.getCourseById(req, res, next))

// Get courses by title (optional if needed)
router.get('/title/:title', (req, res, next) => CoursesController.getCourseByTitle(req, res, next))

// Create a new course
router.post('/', (req, res, next) => CoursesController.addCourse(req, res, next))

// Update a course
router.put('/:id', (req, res, next) => CoursesController.updateCourse(req, res, next))

// Delete a course
router.delete('/:id', (req, res, next) => CoursesController.deleteCourse(req, res, next))
