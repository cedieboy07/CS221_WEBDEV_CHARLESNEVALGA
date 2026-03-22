import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from "../components/Card";
import Button from "../components/Button";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import { useAuth } from "../contexts/AuthContext";
import "./AuthPages.css";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (errors.error) setErrors({});
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setErrors({ error: "Passwords do not match." });
      return;
    }

    try {
      setLoading(true);
      setErrors({});
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });
      alert("Registration successful! Please log in.");
      navigate("/login");
    } catch (error) {
      setErrors({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <Header />
      
      <div className="auth-container">
        <Card title="Create Account" className="auth-card">
          <form onSubmit={handleSubmit} className="auth-form">
            {errors.error && (
              <div className="auth-error">
                {errors.error}
              </div>
            )}
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                required
              />
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
              />
            </div>
            <Button type="submit" loading={loading}>
              Register
            </Button>
          </form>
          
          <div className="auth-switch">
            <p>Already have an account?</p>
            <Link to="/login">Login here</Link>
          </div>
        </Card>
      </div>
      
      <Footer />
    </div>
  );
};

export default Register;
