import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Login() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  function validate() {
    const e = {};
    if (!email) {
      e.email = 'Email address is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) e.email = 'Invalid email address';
    }
    if (!password) {
      e.password = 'Password is required';
    } else if (password.length < 5) {
      e.password = 'Password must be at least 5 characters long';
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
      const result = await login(email, password);
      if (result.success) {
        showToast('Successfully logged in!', 'success');
        navigate('/admin'); // Redirect straight to admin panel on login success
      } else {
        showToast(result.message || 'Invalid email or password.', 'error');
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
          <h1 className="fw-bold">Sign In</h1>
          <p className="fs-5 text-white-50">Access the EliteHomes management dashboard</p>
        </div>
      </div>

      <section className="py-5 bg-body-tertiary">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-5">
              <div className="card border-0 shadow-sm rounded-4 p-4 p-sm-5">
                <div className="text-center mb-4">
                  <i className="fa-solid fa-shield-halved fa-3x mb-3 text-purple" style={{ color: 'var(--main-color)' }}></i>
                  <h3 className="fw-bold">Welcome Back</h3>
                  <p className="text-muted">Enter credentials to authenticate session</p>
                </div>

                <form onSubmit={handleSubmit} noValidate>
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
                        placeholder="name@example.com"
                        required
                      />
                    </div>
                    {errors.email && <div className="text-danger mt-1" style={{ fontSize: 13 }}>{errors.email}</div>}
                  </div>

                  {/* Password */}
                  <div className="mb-4">
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

                  <div className="d-grid gap-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn btn-start text-white p-3 fw-bold rounded-3 submit-btn"
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Verifying Account...
                        </>
                      ) : (
                        <>
                          <i className="fa-solid fa-arrow-right-to-bracket me-2"></i> Log In
                        </>
                      )}
                    </button>
                  </div>
                </form>

                <div className="text-center mt-4">
                  <p className="small text-muted mb-2">
                    Don't have an account? <Link to="/signup" className="text-purple fw-bold text-decoration-none" style={{ color: 'var(--main-color)' }}>Sign Up</Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
