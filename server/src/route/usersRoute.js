import express from 'express'
import UsersController from '../controller/UserController.js'
import {checkRole} from '../middleware/roleMiddelwere.js'

export const router = express.Router()


router.get('/:id', (req, res, next) => UsersController.getUserById(req, res, next))
router.get('/', (req, res, next) => UsersController.getAllUsers(req, res, next))
router.get('/name/:name', (req, res, next) => UsersController.getUserByName(req, res, next))
router.get('/email/:email', (req, res, next) => UsersController.getUserByEmail(req, res, next))
router.get('/username/:username', UsersController.getUserByUsername)
router.post('/login', (req, res, next) => UsersController.loginUser(req, res, next))
router.post('/', (req, res, next) => UsersController.addUser(req, res, next))



router.put('/:id',checkRole(["user", "admin"]), UsersController.updateUser)
router.delete('/:id', (req, res, next) => UsersController.deleteUser(req, res, next))