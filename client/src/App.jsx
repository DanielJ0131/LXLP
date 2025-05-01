import { Routes, Route } from 'react-router-dom'
import Login from './components/login'
import Register from './components/register'
import './App.css'

function App() {
  return (
    <div>
      <header>
        <h1>Linux Learning Platform</h1>
      </header>

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>

      <footer>
        <p>© LXLP. All Rights Reserved</p>
        <a href="mailto:linuxlearningplatform@gmail.com">linuxlearningplatform@gmail.com</a>
      </footer>
    </div>
  )
}

export default App