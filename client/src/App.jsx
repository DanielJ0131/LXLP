import { useState, useEffect, use } from 'react'
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
    const [theme, setTheme] = useState('light');

    const toggleTheme = () => {
      const newTheme = theme === 'light' ? 'dark' : 'light';
      setTheme(newTheme);
      document.body.className = newTheme; // Apply the theme to the body
    }

    
    useEffect(() => {
      const savesTheme = localStorage.getItem('theme') || 'dark';
      setTheme(savesTheme);
      document.body.className = savesTheme; // Apply the theme to the body
    }, []);

    useEffect(() => {
      localStorage.setItem('theme', theme);
      document.body.className = theme; // Apply the theme to the body
    }, [theme]);



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

      useEffect(()=>{
        const fetchUser = async ()=>{
          const res = await fetch('/api/jwt/token', {
            method: 'GET',
            credentials: 'include'
          })

          const data = await res.json()

          if(res.ok){
            setUser(data.payload) // the content from jwt , should be the first name as we want
          }
        }

        fetchUser()
      },[])
  
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

        
        // Theme toggle button
        <section className="theme-toggle">
          <button onClick={toggleTheme}>
            {theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          </button>
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
      {currentUrl.includes('forum') && <Forum user={user} />} 
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