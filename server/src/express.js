import express from 'express'
import helmet from 'helmet'
import logger from 'morgan'
import {router} from './route/index.js'
import {errorHandler} from './middleware/errorHandler.js'
import cors from 'cors' // Import cors for cross-origin resource sharing
import cookieParser from 'cookie-parser'

export const app = express()


// Use the morgan logger
if (process.env.NODE_ENV !== 'test') {
    app.use(logger('dev', {immediate: true}))
}

// Use helmet as a basic protection layer
app.use(helmet())



// Enable CORS for specific origins
const corsOptions = {
    origin: [
        'http://localhost:5000',   // Allow HTTP origin
        'ws://localhost:8080',      // Allow WebSocket origin
        'http://localhost:5173',  // Allow  frontend URL,
        'https://lxlp.onrender.com' // Allow render
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Optional: specify allowed methods
    credentials: true,            // Optional: if you need to include credentials (cookies, authorization headers, etc.),

}

// Make sure that we have cookie parser to send via cookies
app.use(cookieParser())

app.use(cors(corsOptions))

// Set Content Security Policy header allowing WebSocket connections
app.use((req, res, next) => {
    res.setHeader('Content-Security-Policy',"", "default-src 'self'; style-src 'self' 'unsafe-inline'; connect-src 'self' ws://localhost:8080;")
    next()
})

// Be more silent
app.disable('x-powered-by')

// Use the public folder for static resources
// app.use(express.static('public'))

// Use the public folder for static resources
app.use(express.static('../client/dist/'))

// Middleware to parse JSON data as part of the body
app.use(express.json())

// Redirect from the server's root to the client's /home
// app.get('/', (req, res) => {
//     res.redirect('http://localhost:5173/home');
// });


// Mount the routes
app.use('/', router)

app.use((req, res, next) => {
    res.sendFile('index.html', { root: '../client/dist' }, (err) => {
        if (err) {
            next(err)
        }
    })
})

// Middleware för 404
app.use(errorHandler.notFoundDefault)

// Global felhanterare
app.use(errorHandler.errorDefault)
