import React from 'react';
import { useState, useEffect } from 'react'
import Home from './components/home.jsx';
import About from './components/about.jsx';
import XTerminal from "./components/terminal.js";
import Forum from './components/forum.jsx';
import Login from './components/login.jsx';
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
      <div>
      <header>
        <h1>Linux Learning Platform</h1>
        
      </header>
      <main>
        {user ?
         (<p>👋Welcome, {user.firstname}</p>)
          : (
            <p>👋Welcome, Guest!</p>
          )
        }
        <nav>
          <ul>
            <li><a href="/home">Home</a></li>
            <li><a href="/courses">Courses</a></li>
            <li><a href="/forum">Forum</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/terminal">Terminal</a></li>
            <li><a href="/login">Login</a></li>
            <li><a href="/register">Register</a></li>
          </ul>
        </nav>
        
        {currentUrl.includes('home') && <Home />}
        {currentUrl.includes('about') && <About />}
        {currentUrl.includes('courses') && <Courses />}
        {currentUrl.includes('forum') && <Forum />} 
         {currentUrl.includes('terminal') && <XTerminal />}
        {currentUrl.includes('login') && <Login />}
        {currentUrl.includes('register') && <Register />}
      </main>
      <footer>
        <p>© LXLP. All Rights Reserved</p>
        <a href="mailto:linuxlearningplatform@gmail.com">linuxlearningplatform@gmail.com</a>
      </footer>
      </div>
    );

    function switchStylesheet(theme) {
      const link = document.querySelector('link[href="./App.css"]');
      if (link) {
        if (theme === 'dark-theme') {
          link.href = 'App2.css';
        } else if (theme === 'white-theme') {
          link.href = 'App1.css';
        } else {
          link.href = 'App.css';
        }
      }
      document.body.className = theme;
    }
  }
  
  export default App