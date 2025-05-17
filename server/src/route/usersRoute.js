import express from 'express'
import UsersController from '../controller/UserController.js'
import {checkRole} from '../middleware/roleMiddelwere.js'
import {jwtMiddleware} from '../middleware/jwtMiddlewere.js'

export const router = express.Router()

router.post('/request-password-reset', UsersController.requestPasswordReset)
router.post('/reset-password', UsersController.resetPassword)
router.get('/email/:email', UsersController.getUserByEmail)

router.use(jwtMiddleware.jwtTokenIsValid)

router.get('/:id', checkRole(["admin", "users"]), UsersController.getUserById)
router.get('/', checkRole(["admin"]),UsersController.getAllUsers)
router.get('/name/:name', checkRole(["admin","user"]), UsersController.getUserByName)
router.get('/username/:username', checkRole(["admin", "user"]), UsersController.getUserByUsername)
router.post('/', checkRole(["admin"]), UsersController.addUser)
router.put('/:id', checkRole(["user", "admin"]), UsersController.updateUser)
router.delete('/:id', checkRole(["admin", "user"]), UsersController.deleteUser)
router.patch('/update-password/', checkRole(["user", "admin"]), UsersController.updatePassword)

