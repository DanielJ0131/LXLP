import { useState, useEffect } from 'react'
import './App.css'
import Home from './components/home.jsx'

function App() {
  const [currentUrl, setCurrentUrl] = useState(window.location.href);

  useEffect(() => {
    const handleUrlChange = () => {
      setCurrentUrl(window.location.href);
    };

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
        {currentUrl.includes('home') && <Home />}
      </main>
      <footer>
        <p>© LXLP. All Rights Reserved</p>
        <a href="mailto:linuxlearningplatform@gmail.com">linuxlearningplatform@gmail.com</a>
      </footer>
    </div>
  )
}

export default App
