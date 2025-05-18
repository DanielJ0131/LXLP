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
    <div className="reset-password-container">
      <form className="reset-password-form" onSubmit={handleSubmit}>
        <h2>Forgot Password?</h2>
        <input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          disabled={isSubmitting}
        />
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Sending...' : 'Send reset email'}
        </button>
        {message && <p className="reset-message">{message}</p>}
      </form>
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
        .reset-password-form input[type="email"] {
          padding: 12px 44px 12px 12px;
          border: 1px solid var(--nav-bg);
          border-radius: 6px;
          font-size: 1rem;
          outline: none;
          transition: border 0.2s;
        }
        .reset-password-form input[type="email"]:focus {
          border-color: #2563eb;
        }
        .reset-password-form button {
          padding: 0.7rem 1rem;
          background: var(--accent-color);
          color: black;
          border: none;
          border-radius: 6px;
          font-size: 1rem;
          cursor: pointer;
          transition: background 0.2s;
        }
        .reset-password-form button:hover:enabled {
          background: linear-gradient(90deg, #818cf8 60%, #6366f1 100%);
        }
        .reset-message {
          margin: 0;
          color: #059669;
          font-size: 1rem;
          text-align: center;
        }
      `}</style>
    </div>
  )
}