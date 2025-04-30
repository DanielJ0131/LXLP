import express from 'express'
// import { router as apikeyRoute } from './apikeyRoute.js'
// import { router as jwtRoute } from './jwtRoute.js'
import { router as usersRoute } from './usersRoute.js'
// This will be the main route connecting all the other routes
// once we have jwt, api and user database routes.

export const router = express.Router()


router.use('/api/users', usersRoute)