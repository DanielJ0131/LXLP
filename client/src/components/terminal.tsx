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
        <div
            style={{
                background: "linear-gradient(135deg, #232526 0%, #414345 100%)",
                color: "#39ff14",
                fontFamily: "Fira Mono, monospace",
                padding: 32,
                borderRadius: 16,
                overflow: "hidden",
                boxSizing: "border-box",
                display: "flex",
                flexDirection: "column",
                boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
                border: "2px solid #39ff14",
            }}
        >
            <div
                ref={scrollRef}
                style={{
                    flex: 1,
                    overflowY: "auto",
                    marginBottom: 16,
                    whiteSpace: "pre-wrap",
                    fontSize: 22,
                    lineHeight: 1.7,
                    letterSpacing: 0.5,
                    paddingRight: 8,
                }}
            >
                {history.map((line, i) => (
                    <div key={i}>{line}</div>
                ))}
            </div>
            <form onSubmit={onSubmit} style={{ display: "flex", alignItems: "center" }}>
                <span style={{ fontWeight: "bold", fontSize: 24 }}>$&nbsp;</span>
                <input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={onKeyDown}
                    style={{
                        background: "transparent",
                        color: "#39ff14",
                        border: "none",
                        outline: "none",
                        flex: 1,
                        fontFamily: "Fira Mono, monospace",
                        fontSize: 24,
                        padding: "6px 0",
                        caretColor: "#39ff14",
                    }}
                    autoComplete="off"
                />
            </form>
        </div>
    );
}
