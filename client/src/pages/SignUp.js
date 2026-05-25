import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from '../context/ToastContext';
import API_BASE_URL from '../config';

export default function SignUp() {
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  function validate() {
    const e = {};
    if (!name.trim()) e.name = 'Full name is required';
    
    if (!email) {
      e.email = 'Email address is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) e.email = 'Invalid email address';
    }
    
    if (!password) {
      e.password = 'Password is required';
    } else if (password.length < 5) {
      e.password = 'Password must be at least 5 characters';
    }
    
    if (password !== confirmPassword) {
      e.confirmPassword = 'Passwords do not match';
    }
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      
      if (data.success) {
        showToast('Registration successful! Please log in.', 'success');
        navigate('/login');
      } else {
        showToast(data.message || 'Registration failed.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('An unexpected server error occurred. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="page-header py-5 text-white text-center">
        <div className="container pt-4">
          <h1 className="fw-bold">Sign Up</h1>
          <p className="fs-5 text-white-50">Create an account to join EliteHomes</p>
        </div>
      </div>

      <section className="py-5 bg-body-tertiary">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-5">
              <div className="card border-0 shadow-sm rounded-4 p-4 p-sm-5">
                <div className="text-center mb-4">
                  <i className="fa-solid fa-user-plus fa-3x mb-3 text-purple" style={{ color: 'var(--main-color)' }}></i>
                  <h3 className="fw-bold">Create Account</h3>
                  <p className="text-muted">Register to schedule tours and contact agents</p>
                </div>

                <form onSubmit={handleSubmit} noValidate>
                  {/* Name */}
                  <div className="mb-3">
                    <label htmlFor="name" className="fw-semibold small mb-1">Full Name</label>
                    <div className={`input-group rounded-3 p-2 bg-body-tertiary ${errors.name ? 'border-danger' : ''}`}>
                      <span className="input-group-text bg-transparent border-0">
                        <i className="fa-solid fa-user text-muted"></i>
                      </span>
                      <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                        }}
                        className="form-control border-0 shadow-none bg-body-tertiary"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    {errors.name && <div className="text-danger mt-1" style={{ fontSize: 13 }}>{errors.name}</div>}
                  </div>

                  {/* Email */}
                  <div className="mb-3">
                    <label htmlFor="email" className="fw-semibold small mb-1">Email Address</label>
                    <div className={`input-group rounded-3 p-2 bg-body-tertiary ${errors.email ? 'border-danger' : ''}`}>
                      <span className="input-group-text bg-transparent border-0">
                        <i className="fa-solid fa-envelope text-muted"></i>
                      </span>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                        }}
                        className="form-control border-0 shadow-none bg-body-tertiary"
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                    {errors.email && <div className="text-danger mt-1" style={{ fontSize: 13 }}>{errors.email}</div>}
                  </div>

                  {/* Password */}
                  <div className="mb-3">
                    <label htmlFor="password" className="fw-semibold small mb-1">Password</label>
                    <div className={`input-group rounded-3 p-2 bg-body-tertiary ${errors.password ? 'border-danger' : ''}`}>
                      <span className="input-group-text bg-transparent border-0">
                        <i className="fa-solid fa-lock text-muted"></i>
                      </span>
                      <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
                        }}
                        className="form-control border-0 shadow-none bg-body-tertiary"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                    {errors.password && <div className="text-danger mt-1" style={{ fontSize: 13 }}>{errors.password}</div>}
                  </div>

                  {/* Confirm Password */}
                  <div className="mb-4">
                    <label htmlFor="confirmPassword" className="fw-semibold small mb-1">Confirm Password</label>
                    <div className={`input-group rounded-3 p-2 bg-body-tertiary ${errors.confirmPassword ? 'border-danger' : ''}`}>
                      <span className="input-group-text bg-transparent border-0">
                        <i className="fa-solid fa-shield text-muted"></i>
                      </span>
                      <input
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: '' }));
                        }}
                        className="form-control border-0 shadow-none bg-body-tertiary"
                        placeholder="••••••••"
                        required
                      />
                    </div>
                    {errors.confirmPassword && <div className="text-danger mt-1" style={{ fontSize: 13 }}>{errors.confirmPassword}</div>}
                  </div>

                  <div className="d-grid gap-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn btn-start text-white p-3 fw-bold rounded-3 submit-btn"
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Registering...
                        </>
                      ) : (
                        <>
                          <i className="fa-solid fa-user-check me-2"></i> Register Account
                        </>
                      )}
                    </button>
                  </div>
                </form>

                <div className="text-center mt-4">
                  <span className="text-muted small">
                    Already have an account? <Link to="/login" className="text-purple fw-bold text-decoration-none" style={{ color: 'var(--main-color)' }}>Log In</Link>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
