import DatabaseService from '../service/DatabaseService.js'

/**
 * The CoursesModel class provides methods to interact with the course data in the database.
 */
class CoursesModel {
    /**
     * Retrieves a single course from the database by its ID.
     *
     * @param {string} courseId - The ID of the course to retrieve.
     * @returns {Promise<Object|null>} A promise that resolves to the course object if found, or null if not found.
     */
    async getCourseById(courseId) {
        try {
            const course = await DatabaseService.courses.findById(courseId)
            return course
        } catch (error) {
            console.log(error)
        }
    }

    /**
     * Retrieves all courses from the database.
     *
     * @returns {Promise<Array<Object>>} A promise that resolves to an array of course objects.
     */
    async getAllCourses() {
        try {
            const courses = await DatabaseService.courses.find()
            return courses
        } catch (error) {
            console.log(error)
        }
    }
}


export default new CoursesModel()
