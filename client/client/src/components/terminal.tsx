import {Terminal} from '@xterm/xterm'
import {useEffect, useRef} from "react"
import "@xterm/xterm/css/xterm.css"
import '../styles/terminal.css'
import React from 'react'

const term = new Terminal()
term.write('Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ')

function XTerminal() {
    const terminalRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        if (!terminalRef.current)
            return

        term.open(terminalRef.current)
    }, [terminalRef])

    return (
        <div ref={terminalRef}></div>
    )
}

export default XTerminal