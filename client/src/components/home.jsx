import '../styles/home.css';
import linuxLogo from '../assets/linux2.png';
import { useEffect, useRef, useState } from 'react';

export default function Home() {
    function getRandomChar() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        return chars[Math.floor(Math.random() * chars.length)];
    }

    function drawMatrix(ctx, width, height, columns, drops, fontSize) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = '#0F0';
        ctx.font = `${fontSize}px monospace`;

        for (let i = 0; i < columns; i++) {
            const text = getRandomChar();
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            if (drops[i] * fontSize > height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }

    function useCMatrixAnimation(canvasRef, setShowMatrix) {
        useEffect(() => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            let animationFrameId;
            const fontSize = 18;
            let width = canvas.width = canvas.offsetWidth;
            let height = canvas.height = canvas.offsetHeight;
            let columns = Math.floor(width / fontSize);
            let drops = Array(columns).fill(1);

            let running = true;

            function animate() {
                if (!running) return;
                drawMatrix(ctx, width, height, columns, drops, fontSize);
                animationFrameId = requestAnimationFrame(animate);
            }

            animate();

            // Stop animation after 3 seconds
            const timeoutId = setTimeout(() => {
                running = false;
                cancelAnimationFrame(animationFrameId);
                setShowMatrix(false); // Hide the canvas after animation
            }, 2000);

            function handleResize() {
                width = canvas.width = canvas.offsetWidth;
                height = canvas.height = canvas.offsetHeight;
                columns = Math.floor(width / fontSize);
                drops = Array(columns).fill(1);
            }

            window.addEventListener('resize', handleResize);

            return () => {
                running = false;
                cancelAnimationFrame(animationFrameId);
                clearTimeout(timeoutId);
                window.removeEventListener('resize', handleResize);
            };
        }, [canvasRef, setShowMatrix]);
    }

    const canvasRef = useRef(null);
    const [showMatrix, setShowMatrix] = useState(true);
    useCMatrixAnimation(canvasRef, setShowMatrix);

    return (
        <div className="home-container">
            {showMatrix && (
                <canvas
                    ref={canvasRef}
                    className="matrix-canvas"
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        zIndex: 0,
                    }}
                />
            )}
            <div style={{ position: 'relative', zIndex: 1 }}>
                <img src={linuxLogo} alt="Linux Logo" className="linux-logo" />
                <h1>Welcome to LXLP</h1>
                <p>
                    This platform is built for complete beginners and aspiring professionals who want to learn Linux from scratch.
                    Explore interactive courses, ask questions in the forum, and build your skills step-by-step.
                </p>
            </div>
        </div>
    );
}
