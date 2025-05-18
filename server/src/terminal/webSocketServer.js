import { WebSocketServer } from 'ws';
import http from 'http';
import * as pty from 'node-pty';
import { exec } from 'child_process';

class WSS_Server {
    static startServer = (app) => {
        const port = process.env.PORT_WSS || 8080;
        const server = http.createServer(app);
        const wss = new WebSocketServer({ server });
        const allowedIP = "http://" + process.env.IP + ":" + process.env.PORT;
        const allowedSecureIP = "https://" + process.env.IP + ":" + process.env.PORT;

        // Function to check if the origin is allowed
        const originIsAllowed = (origin) => {
            const allowedOrigins = [
                'https://lxlp.onrender.com',
                'http://localhost:5000',
                allowedIP,
                allowedSecureIP,
            ];
            return allowedOrigins.includes(origin);
        };

        // Helper function to generate unique session IDs
        const generateSessionId = () => {
            return Math.random().toString(36).substring(2, 15);
        };

        wss.on('connection', (ws, request) => {
            // Origin validation
            if (!originIsAllowed(request.headers.origin)) {
                ws.close();
                console.warn(`[${new Date()}] Rejected connection from origin: ${request.headers.origin}`);
                return;
            }

            console.log(`[${new Date()}] New connection from: ${request.headers.origin}`);

            const sessionId = generateSessionId();
            const dockerImage = 'alpine:latest';
            const dockerCommand = ['/bin/sh'];
            let ptyProcess = null;

            // Clean up any existing container with this session ID first
            exec(`docker kill ws-terminal-${sessionId}`, () => {
                // Start new container with unique name
                ptyProcess = pty.spawn('docker', [
                    'run',
                    '-it',
                    '--rm',
                    `--name=ws-terminal-${sessionId}`,
                    dockerImage,
                    ...dockerCommand
                ], {
                    name: 'xterm-color',
                    env: process.env,
                });

                // Handle messages from client
                ws.on('message', (message) => {
                    try {
                        const data = JSON.parse(message.toString());
                        if (data.type === 'command') {
                            ptyProcess.write(data.data + '\r\n');
                        }
                    } catch (error) {
                        console.warn('Received non-JSON message:', message.toString());
                        ptyProcess.write(message.toString() + '\r\n');
                    }
                });

                // Handle client disconnect - KILL THE CONTAINER
                ws.on('close', () => {
                    console.log(`[${new Date()}] Client disconnected, killing container ws-terminal-${sessionId}`);
                    exec(`docker kill ws-terminal-${sessionId}`, (err) => {
                        if (err) console.error('Error killing container:', err);
                    });
                    if (ptyProcess) ptyProcess.kill();
                });

                // Send terminal output to client
                ptyProcess.onData((data) => {
                    const message = JSON.stringify({
                        type: 'data',
                        data,
                    });
                    ws.send(message);
                });

                // Handle terminal exit
                ptyProcess.onExit(() => {
                    console.log(`[${new Date()}] Terminal process exited`);
                    ws.close();
                });
            });
        });

        // Server startup
        server.listen(port, () => {
            console.log(`WebSocket Server listening on port ${port}`);
        });

        // Graceful shutdown
        const shutdown = () => {
            console.log('Shutting down WebSocket server...');
            wss.clients.forEach(client => client.terminate());
            server.close();
        };

        process.on('SIGINT', shutdown);
        process.on('SIGTERM', shutdown);
    };
}

export default WSS_Server;