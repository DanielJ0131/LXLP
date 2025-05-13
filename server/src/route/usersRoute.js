import express from 'express'
import UsersController from '../controller/UserController.js'
import {checkRole} from '../middleware/roleMiddelwere.js'

export const router = express.Router()


router.get('/:id', UsersController.getUserById)
router.get('/', UsersController.getAllUsers)
router.get('/name/:name', checkRole(["admin","user"]), UsersController.getUserByName)
router.get('/email/:email',checkRole(["admin", "user"]), UsersController.getUserByEmail)
router.get('/username/:username', checkRole(["admin", "user"]), UsersController.getUserByUsername)
router.post('/', checkRole(["admin", "user"]), UsersController.addUser)
router.put('/:id', checkRole(["user", "admin"]), UsersController.updateUser)
router.delete('/:id', checkRole(["admin", "user"]), UsersController.deleteUser)
