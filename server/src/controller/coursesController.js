import CoursesModel from "../model/CoursesModel.js";


/**
 * Controller to perform CRUD for the courses collection.
 *
 * @class
 */
class CoursesController {
    /**
     * Get a course by ID.
     *
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    async getCourseById(req, res, next) {
        try {
            const courseId = req.params.id;
            const course = await CoursesModel.getCourseById(courseId);
            if (!course) {
                return res.status(404).json({ message: 'Course not found' });
            }

            res.status(200).json(course);
        } catch (error) {
            next(error);
        }
    }



    /**
     * Get all courses.
     *
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     */
    async getAllCourses(req, res, next) {
        try {
            const courses = await CoursesModel.getAllCourses();
            res.status(200).json(courses);
        } catch (error) {
            next(error);
        }
    }
}


export default new CoursesController();