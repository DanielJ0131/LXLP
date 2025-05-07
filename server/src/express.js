import express from 'express'
import helmet from 'helmet'
import logger from 'morgan'
import {router} from './route/index.js'
import {errorHandler} from './middleware/errorHandler.js'
import cors from 'cors' // Import cors for cross-origin resource sharing
// import WSS_Server from "./webSocketServer.js";


export const app = express()

// Start Websocket server for terminal
// WSS_Server.startServer(app)

// Use the morgan logger
if (process.env.NODE_ENV !== 'test') {
    app.use(logger('dev', {immediate: true}))
}

// Use helmet as a basic protection layer
app.use(helmet())


app.use(cors())

// Be more silent
app.disable('x-powered-by')

// Use the public folder for static resources
// app.use(express.static('public'))

// Use the public folder for static resources
app.use(express.static('../client/dist'))

// Middleware to parse JSON data as part of the body
app.use(express.json())

// Redirect from the server's root to the client's /home
// app.get('/', (req, res) => {
//     res.redirect('http://localhost:5173/home');
// });

app.use((req, res, next) => {
    res.sendFile('index.html', { root: '../client/dist' }, (err) => {
        if (err) {
            next(err)
        }
    })
})

// Mount the routes
app.use('/', router)

// Middleware för 404
app.use(errorHandler.notFoundDefault)

// Global felhanterare
app.use(errorHandler.errorDefault)
