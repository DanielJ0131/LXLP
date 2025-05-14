import { useEffect } from 'react';
import { fetchWithAuth } from '../utils/http.js';
import '../styles/logout.css';

const LogoutHandler = () => {
    useEffect(() => {
        const logout = async () => {
            try {
                // Make API call to blacklist the token
                await fetchWithAuth('http://localhost:5000/api/jwt/logout', {
                    method: 'POST',
                });
            } catch (error) {
                console.error('Error blacklisting token:', error);
            } finally {
                // Clear auth data
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                // Redirect after 2 seconds
                const timer = setTimeout(() => {
                    window.location.href = '/login';
                }, 2000);
                clearTimeout(timer);
            }
        };

        logout();
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
