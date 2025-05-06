import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import '../styles/register.css'

export default function Register() {
    const [formData, setFormData] = useState({
        email: '',
        name: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        try {
            const response = await fetch("http://localhost:3000/api/users", { 
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData)
            });
    
            const data = await response.json();
    
            if (!response.ok) {
            
                setError(data.message || "Something went wrong");
                setSuccess('');
            } else {
                setSuccess("User successfully created!");
                setError('');
                setFormData({ email: '', name: '', password: '' }); 
            }
        } catch (err) {
            console.error("Error submitting form:", err);
            setError("Network error. Please try again later.");
            setSuccess('');
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <fieldset className="register-fieldset">
                    <legend>Create an Account</legend>

                    <div className="create-acc-input">
                        <label htmlFor="name">Username</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="create-acc-input">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="create-acc-input">
                        <label htmlFor="password">Password</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        <button
                            type="button"
                            className="toggle-password"
                            onClick={() => setShowPassword((prev) => !prev)}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>

                    <button type="submit">Create Account</button>

                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    {success && <p style={{ color: 'green' }}>{success}</p>}
                </fieldset>
            </form>
        </>
    );
}