import {WebSocketServer} from 'ws' // A way to communicate between client and server without request
import http from 'http' // Needed for the new server
import * as pty from 'node-pty'
import os from 'os'


class WSS_Server {
    static startServer = (app) => {
        const port = process.env.PORT_WSS || 8080   // Dedicated port for WSS
        const server = http.createServer(app)   // Create HTTP server
        const wss = new WebSocketServer({server}) // Pass server into WSS

        // Do different stuff on connection
        wss.on('connection', (ws) => {
            // Spawn a terminal
            // Determine the shell based on the operating system
            const shell = os.platform() === 'win32' ? 'cmd.exe' : 'bash';  // Or 'powershell.exe'
            const ptyProcess = pty.spawn(shell, [], {
                name: 'xterm-color',
                env: process.env,
            });

            ws.on('message', (message) => {
                try{
                    const data = Json.parse(message.toString());
                    if (data.type === "commmand"){
                        ptyProcess.write(data.data + '\r\n')
                    }
                }catch(error){
                    //If parsing fails, assume it's a plain text command
                    console.warn('Received non-JSON message: ' + message.toString())
                    ptyProcess.write(message.toString() + '\r\n');
                }
            })

            ws.on('close', () => {
                console.log('closed websocket')
                ptyProcess.kill() // Ensure the spawned process is terminated
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
        async function shutdown() {
            server.close()
        }

        process.on('SIGINT', shutdown)
        process.on('SIGTERM', shutdown)
    }
}


export default WSS_Server