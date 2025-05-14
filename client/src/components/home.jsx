import '../styles/home.css';
import linuxLogo from '../assets/linux2.png';

export default function Home() {
    return (
        <div className="home-container">
            <img src={linuxLogo} alt="Linux Logo" className="linux-logo" />
            <h1>Welcome to LXLP</h1>
            <p>
                This platform is built for complete beginners and aspiring professionals who want to learn Linux from scratch.
                Explore interactive courses, ask questions in the forum, and build your skills step-by-step.
            </p>
        </div>
    );
}
