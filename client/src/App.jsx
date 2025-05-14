import { useState, useEffect } from 'react'
import Home from './components/home.jsx';
import About from './components/about.jsx';
import XTerminal from "./components/terminal.js";
import Forum from './components/forum.jsx';
import Login from './components/login.jsx';
import Logout from './components/logout.jsx';
import Register from './components/register.jsx';
import Courses from './components/courses.jsx';
import './App.css';

function App() {
    const [currentUrl, setCurrentUrl] = useState(window.location.href);
    const [user, setUser] = useState(null)

    
      
    useEffect(() => {
      const handleUrlChange = () => {
        setCurrentUrl(window.location.href);
      };
      if (window.location.pathname === '/') {
        window.location.replace('/home');
      }
  
      window.addEventListener('popstate', handleUrlChange);
      window.addEventListener('pushstate', handleUrlChange); // For custom navigation events if needed
  
      return () => {
        window.removeEventListener('popstate', handleUrlChange);
        window.removeEventListener('pushstate', handleUrlChange);
      };
    }, []);

      useEffect(() => { ////// fetch user from the localStorage
        const savedUser = localStorage.getItem("user")
        if (savedUser) {
          setUser(JSON.parse(savedUser))
        }
      }, [])
  
    return (
      <div className="app-container">

      <header>
      <h1>Linux Learning Platform</h1>
      </header>

      <main>
      <section className="top-navs">
        {user ? (
        <>
          <p>👋 Welcome back, {user.firstname}!</p>
          <section className="auth-links">
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
        <li><a href="/courses">Courses</a></li>
        <li><a href="/forum">Forum</a></li>
        <li><a href="/terminal">Terminal</a></li>
        <li><a href="/about">About</a></li>
      </ul>
      </nav>
      
      {currentUrl.includes('home') && <Home />}
      {currentUrl.includes('about') && <About />}
      {currentUrl.includes('courses') && <Courses />}
      {currentUrl.includes('forum') && <Forum />} 
      {currentUrl.includes('terminal') && <XTerminal />}
      {currentUrl.includes('login') && <Login />}
      {currentUrl.includes('register') && <Register />}
      {currentUrl.includes('logout') && <Logout />}
      </main>
      <footer>
      <p>© LXLP. All Rights Reserved</p>
      <a href="mailto:linuxlearningplatform@gmail.com">linuxlearningplatform@gmail.com</a>
      </footer>
      </div>
    );
  }
  
  export default App