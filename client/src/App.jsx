import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <header>
        <h1>Linux Learning Platform</h1>
      </header>
      <main>MAIN MAIN</main>
      <footer>
        <p>© LXLP. All Rights Reserved</p>
        <a href="mailto:linuxlearningplatform@gmail.com">linuxlearningplatform@gmail.com</a>
      </footer>
    </div>
  )
}

export default App
