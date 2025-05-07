import express from 'express'
import UsersController from '../controller/UserController.js'

export const router = express.Router()


router.get('/:id', (req, res, next) => UsersController.getUserById(req, res, next))
router.get('/', (req, res, next) => UsersController.getAllUsers(req, res, next))
router.get('/name/:name', (req, res, next) => UsersController.getUserByName(req, res, next))
router.get('/email/:email', (req, res, next) => UsersController.getUserByEmail(req, res, next))
router.get('/username/:username', (req, res, next) => UsersController.getUserByUsername(req, res, next))
router.post('/', (req, res, next) => UsersController.addUser(req, res, next))
router.put('/:id', (req, res, next) => UsersController.updateUser(req, res, next))
router.delete('/:id', (req, res, next) => UsersController.deleteUser(req, res, next))