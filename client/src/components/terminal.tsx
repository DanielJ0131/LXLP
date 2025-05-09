import {Terminal} from '@xterm/xterm'
import {useEffect, useRef} from "react"
import "@xterm/xterm/css/xterm.css"
import '../styles/terminal.css'
// @ts-ignore
import React from 'react'




function XTerminal() {
    const terminalRef = useRef<HTMLDivElement | null>(null)
    let currentLine = ""
    const entries = []


     useEffect(() => {
        const term = new Terminal()
        term.open(terminalRef.current)
        term.write('web shell $ ');


        const webSocket = new WebSocket('ws://localhost:8080')

         webSocket.onopen = () => {
             term.write('\r\nWebSocket Connection Established\r\n');
         };


    // Get websocket from backend to work with frontend
        webSocket.onmessage = (event) => {
            const data = JSON.parse(event.data)
            if (event.data.type === 'data') term.write(data) // write in terminal
        }

        term.onKey(({key, domEvent}) => {
            if (domEvent.key === 'Enter') { // Enter key
                term.write('\r\n')
                entries.push(currentLine)

                webSocket.send(currentLine)

                currentLine = ''
            }


            else if (domEvent.key === 'Backspace') {
                if (currentLine) {
                    currentLine = currentLine.slice(0, currentLine.length - 1);
                    term.write('\b \b');
                }
            } else{
              currentLine += key
                term.write(key)
            }
        })

         return () => {
            term.dispose()
             webSocket.close()
         }

    }, [])

    return <div ref={terminalRef}></div>
}

export default XTerminal