import { useEffect } from 'react';
import { fetchWithAuth } from '../utils/http.js';
import '../styles/logout.css';

const LogoutHandler = () => {
    // Handle logout and clearing local storage
    useEffect(() => {
        const logout = async () => {
            try {
                await fetchWithAuth('http://localhost:5000/api/jwt/logout', {
                    method: 'POST',
                });
            } catch (error) {
                console.error('Error blacklisting token:', error);
            } finally {
                localStorage.removeItem('user');
                localStorage.removeItem('token');
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
