import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Courses from './components/Courses.jsx';
import Home from './components/Home.jsx';

import './App.css';

function App() {
  return (
    <Router>
      <div>
        <header>
        
        </header>
        <main>
          <nav>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/Courses">Courses</Link></li>
              
            </ul>
          </nav>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Courses" element={<Courses />} />
            
          </Routes>
        </main>
        <footer>
          <p>© LXLP. All Rights Reserved</p>
          <a href="mailto:linuxlearningplatform@gmail.com">linuxlearningplatform@gmail.com</a>
        </footer>
      </div>
    </Router>
  );
}

export default App;
