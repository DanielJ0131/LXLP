import {WebSocketServer} from 'ws' // A way to communicate between client and server without request
import http from 'http' // Needed for the new server
import {spawn} from 'node-pty'
import databaseService from "./service/DatabaseService.js"; // Needed to bypass threaded ways of node.js


class WSS_Server {
    static startServer = (app) => {
        const port = process.env.PORT_WSS || 8080   // Dedicated port for WSS
        const server = http.createServer(app)   // Create HTTP server
        const wss = new WebSocketServer({server}) // Pass server into WSS

        // Do different stuff on connection
        wss.on('connection', (ws) => {
            // Spawn a terminal
            const ptyProcess = spawn('bash', [], {
                name:  'xterm-color',
                env:  process.env,
            })

            ws.on('message', (message) => {
                console.log('received $', message)

                const data = JSON.parse(message.toString()) // Parse message with json

                if (data.type === 'command'){
                    ptyProcess.write(data.data) // use pty to process data tp type in data that client sends to it
                }
            })

            ws.on('close', () => {
                console.log('closed websocket')
            })

            ptyProcess.onData((data) => {
                const message = JSON.stringify({
                    type: 'data',
                    data,
                })

                ws.send(message + '\n')
            })
        })

        // Listen on different port from express server
        server.listen(port, () => {
            console.log(`Websocket Server on port ${port}`)
        })


        // Shutdown stupid port on server close
        async function shutdown () {
            server.close()
            await databaseService.closeConnection()
        }

        process.on('SIGINT', shutdown)
        process.on('SIGTERM', shutdown)
    }
}


export default WSS_Server