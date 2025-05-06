import express from 'express'
import helmet from 'helmet'
import logger from 'morgan'
import { router } from './route/index.js'
import { errorHandler } from './middleware/errorHandler.js'
import cors from 'cors' // Import cors for cross-origin resource sharing

export const app = express()

// Use the morgan logger
if (process.env.NODE_ENV !== 'test') {
  app.use(logger('dev', { immediate: true }))
}

// Use helmet as a basic protection layer
app.use(helmet())


app.use(cors())

// Be more silent
app.disable('x-powered-by')

// Use the public folder for static resources
app.use(express.static('public'))

// Middleware to parse JSON data as part of the body
app.use(express.json())

// Redirect from the server's root to the client's /home
app.get('/', (req, res) => {
  res.redirect('http://localhost:5173/home');
});


// Mount the routes
app.use('/', router)

// Middleware för 404
app.use(errorHandler.notFoundDefault)

// Global felhanterare
app.use(errorHandler.errorDefault)
