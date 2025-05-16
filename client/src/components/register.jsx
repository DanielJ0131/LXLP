import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { fetchWithAuth } from "../utils/http.js";
import "../styles/register.css";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    firstname: "",
    lastname: "",
    email: "",
    name: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetchWithAuth(
        "/api/jwt/register",
        {
          method: "POST",
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Something went wrong");
        setSuccess("");
      } else {
        setSuccess("Login Successful");

        window.location.href = "/forum";
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      setError("Network error. Please try again later.");
      setSuccess("");
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <fieldset className="register-fieldset">
          <legend>Create an Account</legend>

          <div className="create-acc-input">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div className="create-acc-input">
            <label htmlFor="firstname">First name</label>
            <input
              type="text"
              id="firstname"
              name="firstname"
              value={formData.firstname}
              onChange={handleChange}
              required
            />
          </div>

          <div className="create-acc-input">
            <label htmlFor="lastname">Last name</label>
            <input
              type="text"
              id="lastname"
              name="lastname"
              value={formData.lastname}
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
            <div className="password-input">
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
          </div>

          <button type="submit">Create Account</button>

          {error && <p style={{ color: "red" }}>{error}</p>}
          {success && <p style={{ color: "green" }}>{success}</p>}
        </fieldset>
      </form>
    </>
  );
}
