import { useEffect } from 'react';
import '../styles/logout.css'

const LogoutHandler = () => {
    useEffect(() => {
        // Clear auth data
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        // Redirect after 2 seconds
        const timer = setTimeout(() => {
            window.location.href = '/login';
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="logout-container">
            <div className="logout-box">
                <h2>You have been logged out</h2>
                <p>Thank you for visiting. Redirecting to login page...</p>
            </div>
        </div>
    );
};

export default LogoutHandler;
