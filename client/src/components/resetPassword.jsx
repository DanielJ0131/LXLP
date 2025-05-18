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
    <>
      <style>{`
        .reset-password-container {
          display: flex;
          justify-content: center;
          align-items: center;
          background: transparent;
        }
        .reset-password-form {
          margin: 60px auto;
          background: var(--nav-bg);
          padding: 2.5rem 2rem;
          border-radius: 10px;
          box-shadow: 0 2px 16px rgba(0,0,0,0.08);
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
          min-width: 320px;
        }
        .reset-password-form h2 {
          margin: 0 0 0.5rem 0;
          font-size: 1.5rem;
          color: var(--accent-color);
          text-align: center;
        }
        .login-input {
          position: relative;
          display: flex;
          align-items: center;
        }
        .login-input input {
          width: 100%;
          padding: 12px 44px 12px 12px;
          border: 1px solid var(--nav-bg);
          border-radius: 6px;
          font-size: 1rem;
          outline: none;
          transition: border 0.2s;
        }
        .login-input input:focus {
          border: 1.5px solid #6366f1;
        }
        .toggle-password {
          position: absolute;
          right: 10px;
          background: none;
          border: none;
          cursor: pointer;
          color: var(--accent-color);
          font-size: 1.2rem;
          padding: 4px;
          display: flex;
          align-items: center;
        }
        .reset-password-form button[type="submit"] {
          padding: 0.7rem 1rem;
          background: var(--accent-color);
          color: black;
          border: none;
          border-radius: 6px;
          font-size: 1rem;
          cursor: pointer;
          transition: background 0.2s;
        }
        .reset-password-form button[type="submit"]:hover {
          background: linear-gradient(90deg, #818cf8 60%, #6366f1 100%);
        }
        .reset-password-form p {
          margin-top: 12px;
          color: #059669;
          font-size: 0.98rem;
          text-align: center;
        }
      `}</style>
      <div className="reset-password-container">
        <form className="reset-password-form" onSubmit={handleSubmit}>
          <h2>Change Password</h2>
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
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          <button type="submit">Change password</button>
          {message && <p>{message} Redirecting to login.</p>}
        </form>
      </div>
    </>
  )
}