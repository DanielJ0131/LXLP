import express from 'express'
import UsersController from '../controller/UserController.js'
import {checkRole} from '../middleware/roleMiddelwere.js'
import {jwtMiddleware} from '../middleware/jwtMiddlewere.js'

export const router = express.Router()

//nbeed to have this before to avoid middleware atm
router.get('/test-mail', UsersController.testMail)

router.use(jwtMiddleware.jwtTokenIsValid)

router.get('/:id', UsersController.getUserById)
router.get('/', UsersController.getAllUsers)
router.get('/name/:name', checkRole(["admin","user"]), UsersController.getUserByName)
router.get('/email/:email',checkRole(["admin", "user"]), UsersController.getUserByEmail)
router.get('/username/:username', checkRole(["admin", "user"]), UsersController.getUserByUsername)
router.post('/', checkRole(["admin"]), UsersController.addUser)
router.put('/:id', checkRole(["user", "admin"]), UsersController.updateUser)
router.delete('/:id', checkRole(["admin", "user"]), UsersController.deleteUser)
router.patch('/update-password/', checkRole(["user", "admin"]), UsersController.updatePassword)

