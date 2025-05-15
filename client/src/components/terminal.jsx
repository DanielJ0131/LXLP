import { useState, useRef, useEffect } from "react";
import '../styles/terminal.css'

// Simulate a simple directory tree
const initialFS = {
    "/": ["Documents", "Downloads", "Music", "Pictures", "Videos"],
    "/Documents": [],
    "/Downloads": [],
    "/Music": [],
    "/Pictures": [],
    "/Videos": [],
};

export default function Terminal2() {
    const [history, setHistory] = useState([
        "Welcome to the Browser Terminal! Type 'help' to get started.",
    ]);
    const [input, setInput] = useState("");
    const [commandHistory, setCommandHistory] = useState([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [fs, setFS] = useState(initialFS);
    const [cwd, setCwd] = useState("/");

    const inputRef = useRef(null);
    const scrollRef = useRef(null);

    useEffect(() => {
        inputRef.current.focus();
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }, [history]);

    const commands = {
        help: () => "Available commands: help, echo, clear, date, whoami, ls, mkdir, rm, rmdir, cd, fastfetch, lxlp",
        echo: (args) => args.join(" "),
        date: () => new Date().toString(),
        whoami: () => "browser-user",
        ls: () => (fs[cwd] || []).join("  "),
        mkdir: (args) => {
            if (args.length === 0) return "mkdir: missing operand";
            const dir = args[0];
            if ((fs[cwd] || []).includes(dir)) {
                return `mkdir: cannot create directory '${dir}': File exists`;
            }
            setFS(prev => {
                const newFS = { ...prev, [cwd]: [...prev[cwd], dir] };
                newFS[`${cwd === "/" ? "" : cwd}/${dir}`] = [];
                return newFS;
            });
            return "";
        },
        rm: (args) => {
            if (args.length === 0) return "rm: missing operand";
            const dir = args[0];
            if (!(fs[cwd] || []).includes(dir)) {
                return `rm: cannot remove '${dir}': No such file or directory`;
            }
            setFS(prev => {
                const newFS = { ...prev };
                newFS[cwd] = prev[cwd].filter(d => d !== dir);
                delete newFS[`${cwd === "/" ? "" : cwd}/${dir}`];
                return newFS;
            });
            return "";
        },
        rmdir: (args) => commands.rm(args),
        cd: (args) => {
            if (args.length === 0) return "cd: missing operand";
            let dir = args[0];
            if (dir === "..") {
                if (cwd === "/") return "cd: already at root";
                const parent = cwd.split("/").slice(0, -1).join("/") || "/";
                setCwd(parent);
                return "";
            }
            if (dir.startsWith("/")) {
                // Absolute path
                if (!fs[dir]) return `cd: no such file or directory: ${dir}`;
                setCwd(dir);
                return "";
            }
            // Relative path
            const newPath = `${cwd === "/" ? "" : cwd}/${dir}`;
            if (!fs[newPath]) return `cd: no such file or directory: ${dir}`;
            setCwd(newPath);
            return "";
        },
        fastfetch: () => (
`──────▄▌▐▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▌
───▄▄██▌█ beep beep
▄▄▄▌▐██▌█ LXLP
███████▌█▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▌
▀(@)▀▀▀▀▀▀▀(@)(@)▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀(@)`
        ),
        lxlp: () => (
`L       X   X  L       PPPP
L        X X   L       P   P
L         X    L       PPPP
L        X X   L       P
LLLLL   X   X  LLLLL   P`
        )
    };

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
            `${cwd} $ ${input}`,
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
                <span className="terminal-prompt">{cwd} $&nbsp;</span>
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
