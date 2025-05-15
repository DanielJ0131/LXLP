import { useEffect } from 'react';
import { fetchWithAuth } from '../utils/http.js';
import '../styles/logout.css';

const LogoutHandler = () => {
    // Handle logout and clearing local storage
    useEffect(() => {
        const logout = async () => {
            try {
                await fetchWithAuth('/api/jwt/logout', {
                    method: 'POST',
                });
            } catch (error) {
                console.error('Error blacklisting token:', error);
            }
        };
        logout();
    }, []);

    // Handle redirect after 2 seconds
    useEffect(() => {
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
