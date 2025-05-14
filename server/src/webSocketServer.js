import { WebSocketServer } from 'ws';
import http from 'http';
import * as pty from 'node-pty';
import os from 'os';

class WSS_Server {
    static startServer = (app) => {
        const port = process.env.PORT_WSS || 8080;
        const server = http.createServer(app);
        const wss = new WebSocketServer({ server });

        // Function to check if the origin is allowed
        const originIsAllowed = (origin) => {
            const allowedOrigins = [
                'https://lxlp.onrender.com',
                'http://localhost:5000',
                'http://192.168.0.101:5000' // Server IP

            ];
            return allowedOrigins.includes(origin);
        };

        wss.on('connection', (ws, request) => {
            // Use the originIsAllowed function
            if (!originIsAllowed(request.headers.origin)) {
                ws.close(); // Close the connection
                console.warn((new Date()) + ' Connection from origin ' + request.headers.origin + ' rejected.');
                return;
            }

            // If the origin is allowed, proceed with the connection
            console.log((new Date()) + ' Connection accepted from origin: ' + request.headers.origin);

            // 3. Spawn a terminal
            const shell = os.platform() === 'win32' ? 'cmd.exe' : 'bash';
            const ptyProcess = pty.spawn(shell, [], {
                name: 'xterm-color',
                env: process.env,
            });

            // 4. Handle messages from the client
            ws.on('message', (message) => {
                console.log((new Date()) + ' Received Message: ', message);
                try {
                    const data = JSON.parse(message.toString());
                    if (data.type === 'command') {
                        ptyProcess.write(data.data + '\r\n');
                    }
                } catch (error) {
                    //If parsing fails, assume it's a plain text command
                    console.warn('Received non-JSON message:', message.toString());
                    ptyProcess.write(message.toString() + '\r\n');
                }
            });

            // 5. Handle client disconnects
            ws.on('close', (code, reason) => {
                console.log((new Date()) + ' Peer ' + request.socket.remoteAddress + ' disconnected with code ' + code + ' and reason: ' + reason);
                ptyProcess.kill();
            });

            // 6. Send data from the terminal to the client
            ptyProcess.onData((data) => {
                const message = JSON.stringify({
                    type: 'data',
                    data,
                });
                ws.send(message + '\n');
            });
        });

        // 8.  Listen on the specified port
        server.listen(port, () => {
            console.log(`WebSocket Server listening on port ${port}`);
        });

        // 9.  Graceful shutdown
        async function shutdown() {
            console.log('Shutting down WebSocket server...');
            server.close();
        }

        process.on('SIGINT', shutdown);
        process.on('SIGTERM', shutdown);
    };
}

export default WSS_Server;
