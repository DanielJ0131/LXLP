import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FaEye, FaEyeSlash } from "react-icons/fa"



export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState('')
  const [message, setMessage] = useState('')
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const [showPassword, setShowPassword] = useState(false)



  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await fetch('/api/users/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword })
    })
    const data = await res.json()
    setMessage(data.message || data.error)
    if(res.ok){
        setTimeout(() =>{
            window.location.href = "/login"
        }, 2000)
    }
  }


  return (
    <form onSubmit={handleSubmit}>
      <h2>Change password</h2>
      <div className='login-input'>
        <input
          type={showPassword ? "text" : "password"}
          placeholder="New password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
        <button
          type="button"
          className="toggle-password"
          onClick={() => setShowPassword(prev => !prev)}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
      <button type="submit">Change password</button>
      {message && <p>{message} Redirecting to login.</p>}
    </form>
  )
}