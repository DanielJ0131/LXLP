import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState('')
  const [message, setMessage] = useState('')
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

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
      <input
        type="password"
        placeholder="New password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
      />
      <button type="submit">Change password</button>
      {message && <p>{message}</p>}
      {message }
    </form>
  )
}