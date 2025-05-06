import React from 'react';
import { useState, useEffect } from 'react'
import Home from './components/home.jsx';
import Courses from './components/courses.jsx';
import AboutUs from './components/aboutUs.jsx';
import XTerminal from "./components/terminal.js";
import './App.css';
import Forum from './components/forum.jsx';
// import Login from './components/login.jsx';
// import Register from './components/register.jsx';

function App() {
    const [currentUrl, setCurrentUrl] = useState(window.location.href);
  
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
  
    return (
      <div>
        <header>
          <h1>Linux Learning Platform</h1>
        </header>
        <main>
            <nav>
                <ul>
                    <li><a href="/home">Home</a></li>
                    <li><a href="/courses">Courses</a></li>
                    <li><a href="/forum">Forum</a></li>
                    <li><a href="/aboutUs">About Us</a></li>
                    <li><a href="/terminal">Terminal</a></li>
                </ul>
            </nav>
            
            {currentUrl.includes('home') && <Home />}
            {currentUrl.includes('aboutUs') && <AboutUs />}
            {currentUrl.includes('courses') && <Courses />}
            {currentUrl.includes('forum') && <Forum />} 
            {currentUrl.includes('terminal') && <XTerminal />}
            {/* {currentUrl.includes('login') && <Login />} */}
            {/* {currentUrl.includes('register') && <Register />} */}
        </main>
        <footer>
          <p>© LXLP. All Rights Reserved</p>
          <a href="mailto:linuxlearningplatform@gmail.com">linuxlearningplatform@gmail.com</a>
        </footer>
      </div>
    )
  }
  
  export default App