import {Terminal} from '@xterm/xterm'
import {FitAddon} from 'xterm-addon-fit'
import {useEffect, useRef} from "react"
import "@xterm/xterm/css/xterm.css"
import React from 'react'


function XTerminal() {
    const terminalRef = useRef(null)
    const term = useRef(null)
    const fitAddon = useRef(null)
    const webSocket = useRef(null)
    let currentLine = ""
    const entries = []


    useEffect(() => {
        // Initialize terminal
        term.current = new Terminal({
            cursorBlink: true,
            convertEol: true, // Ensures new line are handled correctly
        })
        fitAddon.current = new FitAddon() // Create fitaddon instance
        term.current.loadAddon(fitAddon.current) // load fitaddon
        term.current.open(terminalRef.current)
        term.current.write('web shell $ ');
        fitAddon.current.fit() // fit terminal to container

        // Handle terminal resizing
        const resizeObserver = new ResizeObserver(() => {
            fitAddon.current?.fit()
        })

        if (terminalRef.current) {
            resizeObserver.observe(terminalRef.current)
        }
        window.addEventListener('resize', () => {
            fitAddon.current?.fit()
        })

        // Initialize websocket connection
        webSocket.current = new WebSocket('ws://localhost:8080')

        webSocket.current.onopen = () => {
            term.current?.write('\r\nWebSocket Connection Established\r\n');
        };


        // Get websocket from backend to work with frontend
        webSocket.current.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data); // Parse the incoming JSON string
                if (message.type === 'data') term.current.write(message.data); // Access the 'data' property of the parsed object

            } catch (error) {
                console.error("Error parsing WebSocket message: ", error);
                term.current?.write(`Error: ${error}\r\n`);
            }
        };

        webSocket.current.close = () => {
            term.current?.write("\r\nWebsocet connection closed\r\n")
        }

        webSocket.current.onerror = (error) => {
            console.log('WebSocket error: ', error)
            term.current?.write(`Websocket error: ${error}\r\n`)
        }


        term.current.onKey(({key, domEvent}) => {
            if (domEvent.key === 'Enter') { // Enter key
                term.current.write('\r\n')
                entries.push(currentLine)

                if (webSocket.current && webSocket.current.readyState === WebSocket.OPEN){
                    webSocket.current.send(JSON.stringify({
                        type: 'command',
                        data: currentLine,
                    }))
                }else{
                    term.current?.write(`WebSocket not connected. Command: ${currentLine}\r\n`)
                }

                currentLine = ''
            } else if (domEvent.key === 'Backspace') {
                if (currentLine.length > 0) {
                    currentLine = currentLine.slice(0, currentLine.length - 1);
                    term.current?.write('\b \b');
                }
            } else {
                currentLine += key
                term.current?.write(key)
            }
        })

        return () => {
            resizeObserver.disconnect()
            window.removeEventListener('resize', () => {
                fitAddon.current?.fit()
            })
            term.current?.dispose()
            webSocket.current?.close()
        }

    }, [])

    return <div ref={terminalRef} className="terminal-container" />
}

export default XTerminal