import {Terminal} from '@xterm/xterm'
import {useEffect, useRef} from "react"
import "@xterm/xterm/css/xterm.css"
import '../styles/terminal.css'
// @ts-ignore
import React from 'react'

const term = new Terminal()
const ws = new WebSocket('ws://localhost:8080')


function XTerminal() {
    const terminalRef = useRef<HTMLDivElement | null>(null)


    // Get websocket from backend to work with frontend
    useEffect(() => {
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data)
            if (event.data.type === 'data') term.write(data) // write in terminal
        }

        return () => {
            ws.close() // close websocket
        }
    }, []);

    // Just a terminal frontend
    useEffect(() => {
        if (!terminalRef.current) return

        term.open(terminalRef.current)

        // Pass the key to the backend
        term.onKey((e) => {
          ws.send(
              JSON.stringify({
                  type: 'command',
                  data: e.key
              })
          )
        })

    }, [terminalRef])

    return (
        <div ref={terminalRef}></div>
    )
}

export default XTerminal