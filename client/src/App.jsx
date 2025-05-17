import { useState, useEffect } from 'react';
import Home from './components/home.jsx';
import About from './components/about.jsx';
import XTerminal from "./components/terminal.jsx";
import Forum from './components/forum.jsx';
import Login from './components/login.jsx';
import Logout from './components/logout.jsx';
import Register from './components/register.jsx';
import Courses from './components/courses.jsx';
import Info from './components/info.jsx';
import Profile from './components/profile.jsx';
import './App.css';
import ResetPassword from './components/resetPassword.jsx';
import ResetPasswordRequest from './components/requestPasswordReset.jsx';


function App() {
  const [currentUrl, setCurrentUrl] = useState(window.location.href);
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('dark'); // Default theme

  // Handle theme switching
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.body.className = newTheme; // Update body class for theme
  };

  // Load saved theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    document.body.className = savedTheme;
  }, []);

  // Persist theme changes to localStorage
  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.body.className = theme;
  }, [theme]);

  // URL Change Handling
  useEffect(() => {
    const handleUrlChange = () => {
      setCurrentUrl(window.location.href);
    };
    if (window.location.pathname === '/') {
      window.location.replace('/home');
    }

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('pushstate', handleUrlChange); // Optional

    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('pushstate', handleUrlChange);
    };
  }, []);

  // Fetch user
  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch('/api/jwt/token', {
        method: 'GET',
        credentials: 'include'
      });

      const data = await res.json();
      if (res.ok) {
        setUser(data.payload); // Expecting payload.firstname
      }
    };

    fetchUser();
  }, []);
  return (
    <div className="app-container">
      <header>
        <h1>Linux Learning Platform</h1>
            {/* Theme Toggle Button */}
          <button onClick={toggleTheme} className="theme-toggle">
            Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode
          </button>
      </header>
      <aside className="sidebar">
      </aside>
      

      <main>
        <section className="top-navs">
          {user ? (
            <>
              <p>👋 Welcome back, {user.firstname}!</p>
              <section className="auth-links">
                <li><a href='/profile'>Profile</a></li>
                <li><a href="/logout">Logout</a></li>
              </section>
            </>
          ) : (
            <>
              <p>👋 Welcome, Guest!</p>
              <section className="auth-links">
                <li><a href="/login">Login</a></li>
                <li><a href="/register">Register</a></li>
              </section>
            </>
          )}
        </section>

        <nav>
          <ul>
            <li><a href="/home">Home</a></li>
            <li><a href="/info">Linux?</a></li>
            <li><a href="/courses">Courses</a></li>
            <li><a href="/forum">Forum</a></li>
            <li><a href="/terminal">Terminal</a></li>
            <li><a href="/about">About</a></li>
          </ul>
        </nav>

        {currentUrl.includes('home') && <Home />}
        {currentUrl.includes('about') && <About />}
        {currentUrl.includes('courses') && <Courses />}
        {currentUrl.includes('forum') && <Forum user={user} />}
        {currentUrl.includes('terminal') && <XTerminal />}
        {currentUrl.includes('login') && <Login />}
        {currentUrl.includes('register') && <Register />}
        {currentUrl.includes('logout') && <Logout />}
        {currentUrl.includes('info') && <Info />}
        {currentUrl.includes('profile') && <Profile user={user} />}
        {currentUrl.includes('request-password-reset') && <ResetPasswordRequest />}
        {currentUrl.includes('reset-password') && <ResetPassword />}
      </main>


      <footer>
        <p>© LXLP. All Rights Reserved</p>
        <a href="mailto:linuxlearningplatform@gmail.com">linuxlearningplatform@gmail.com</a>
      </footer>
    </div>
  );
}

export default App;