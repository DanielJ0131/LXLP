import express from 'express'
import helmet from 'helmet'
import logger from 'morgan'
import { router } from './route/index.js'
import { errorHandler } from './middleware/errorHandler.js'

export const app = express()

// Use the morgan logger
if (process.env.NODE_ENV !== 'test') {
  app.use(logger('dev', { immediate: true }))
}

// Use helmet as a basic protection layer
app.use(helmet())

// Be more silent
app.disable('x-powered-by')

// Use the public folder for static resources
app.use(express.static('public'))

// Middleware to parse JSON data as part of the body
app.use(express.json())

// Mount the routes
app.use('/', router)

// Middleware för 404
app.use(errorHandler.notFoundDefault)

// Global felhanterare
app.use(errorHandler.errorDefault)
