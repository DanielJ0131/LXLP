import { useState } from 'react'
import { FaEye, FaEyeSlash } from "react-icons/fa"
import { fetchWithAuth } from '../utils/http.js'
import '../styles/login.css'



export default function Login(){
    const [formData, setFormData] = useState({ username: '', password: '' })
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [showPassword, setShowPassword] = useState(false)

    const forwardToRegister = () =>{
        return window.location.href = "/register" 
    }

    const forwardToResetPassword = () =>{
        return window.location.href ='/request-password-reset'
    }

    const handleChange = (event) => {
        const { name, value } = event.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        setError('')
        setSuccess('')
    
        try {
            const res = await fetchWithAuth('/api/jwt/login', {
                method: 'POST',
                body: JSON.stringify(formData),
            })
    
            const data = await res.json()
    
            if (!res.ok) {
                throw new Error(data.message || 'Login failed')
            }
    
            setSuccess('Login Successful')
    
            window.location.href = "/forum"  
        } catch (err) {
            setError(err.message)
        }
    }

    return (
        <>

        <form onSubmit={handleSubmit}>
            <fieldset className="login-fieldset">
                <legend>Login</legend>
                <div className='login-input'>
                    <label htmlFor='username'>Username</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className='login-input'>
                    <label htmlFor='password'>Password</label>
                    <input
                        type={showPassword ? "text":"password"}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
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

                <div className ="button-wrp">
                    <button className ="btn btn-primary" type="submit">Log in</button>
                    <button classNAme ="btn btn-secondary" type ="button" onClick={forwardToResetPassword}>Forgot password?</button>
                </div>

                {error && <p style={{ color: 'red' }}>{error}</p>}
                {success && <p style={{ color: 'green' }}>{success}</p>}
            </fieldset>
        </form>
        <p className ="register-link">
            <span className="prompt">Not a user?</span>
            <button onClick ={forwardToRegister}>Create an account!</button>
        </p>
        
        
        </>
        
    )


}