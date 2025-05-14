import { useState, useRef, useEffect } from "react";
import '../styles/terminal.css'

// Simple command handler (expand as needed)
const directoriesRef = { current: ["Documents", "Downloads", "Music", "Pictures", "Videos"] };

const commands = {
    help: () => "Available commands: help, echo, clear, date, whoami, ls, mkdir",
    echo: (args) => args.join(" "),
    date: () => new Date().toString(),
    whoami: () => "browser-user",
    ls: () => directoriesRef.current.join("  "),
    mkdir: (args) => {
        if (args.length === 0) return "mkdir: missing operand";
        const dir = args[0];
        if (directoriesRef.current.includes(dir)) {
            return `mkdir: cannot create directory '${dir}': File exists`;
        }
        directoriesRef.current.push(dir);
        return "";
    },
};

export default function Terminal2() {
    const [history, setHistory] = useState([
        "Welcome to the Browser Terminal! Type 'help' to get started.",
    ]);
    const [input, setInput] = useState("");
    const [commandHistory, setCommandHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const inputRef = useRef(null);
    const scrollRef = useRef(null);

    useEffect(() => {
        inputRef.current.focus();
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [history]);

    const handleCommand = (cmdLine) => {
        const [cmd, ...args] = cmdLine.trim().split(" ");
        if (cmd === "clear") {
            setHistory([]);
            return;
        }
        const handler = commands[cmd];
        if (handler) {
            return handler(args);
        }
        return `Command not found: ${cmd}`;
    };

    const onSubmit = (e) => {
        e.preventDefault();
        if (!input.trim()) return;
        setHistory((h) => [
            ...h,
            `$ ${input}`,
            handleCommand(input),
        ]);
        setCommandHistory((h) => [...h, input]);
        setHistoryIndex(-1);
        setInput("");
    };

    const onKeyDown = (e) => {
        if (e.key === "ArrowUp") {
            if (commandHistory.length === 0) return;
            const newIndex =
                historyIndex < commandHistory.length - 1
                    ? historyIndex + 1
                    : commandHistory.length - 1;
            setHistoryIndex(newIndex);
            setInput(commandHistory[commandHistory.length - 1 - newIndex]);
            e.preventDefault();
        } else if (e.key === "ArrowDown") {
            if (historyIndex <= 0) {
                setHistoryIndex(-1);
                setInput("");
            } else {
                setHistoryIndex(historyIndex - 1);
                setInput(commandHistory[commandHistory.length - historyIndex]);
            }
            e.preventDefault();
        }
    };

    return (
        <div className="terminal-container">
            <div className="terminal-history" ref={scrollRef}>
                {history.map((line, i) => (
                    <div key={i}>{line}</div>
                ))}
            </div>
            <form className="terminal-form" onSubmit={onSubmit}>
                <span className="terminal-prompt">$&nbsp;</span>
                <input
                    className="terminal-input"
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={onKeyDown}
                    autoComplete="off"
                />
            </form>
        </div>
    );
}
