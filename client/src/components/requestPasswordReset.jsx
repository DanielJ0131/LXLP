import { useState } from 'react'

export default function ResetPasswordRequest() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)


  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    const res = await fetch('/api/users/request-password-reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    })
    const data = await res.json()
    setMessage(data.message)
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Forgot Password?</h2>
      <input
        type="email"
        placeholder="Your email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        disabled={isSubmitting}
      />
      <button type="submit" disabled ={isSubmitting}>
        {isSubmitting ? 'Sending...' : 'Send reset email'}
      </button>
      {message && <p>{message}</p>}
    </form>
  )
}