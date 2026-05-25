import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    showToast('Logged out successfully', 'success');
    navigate('/');
  }

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary fixed-top p-3">
      <div className="container">
        <NavLink className="navbar-brand fs-4 text-decoration-none" to="/">EliteHomes</NavLink>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarMain"
          aria-controls="navbarMain"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarMain">
          <ul className="navbar-nav me-0 ms-auto mb-2 mb-lg-0 gap-3 fw-semibold align-items-center">
            <li className="nav-item">
              <NavLink
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                to="/"
                end
              >
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                to="/properties"
              >
                Properties
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                to="/contact"
              >
                Contact
              </NavLink>
            </li>

            {/* Wishlist Link */}
            {user && (
              <li className="nav-item">
                <NavLink
                  className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                  to="/wishlist"
                >
                  Wishlist
                </NavLink>
              </li>
            )}

            {/* Admin Dashboard */}
            {user && user.role === 'admin' && (
              <li className="nav-item">
                <NavLink
                  className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                  to="/admin"
                >
                  Dashboard
                </NavLink>
              </li>
            )}

            {/* Auth Buttons */}
            {user ? (
              <li className="nav-item ms-lg-2">
                <button
                  onClick={handleLogout}
                  className="btn btn-sm btn-outline-danger fw-semibold px-3 py-2 rounded-3 border-2"
                >
                  <i className="fa-solid fa-power-off me-1"></i> Logout ({user.name.split(' ')[0]})
                </button>
              </li>
            ) : (
              <li className="nav-item ms-lg-2">
                <NavLink
                  className="btn btn-sm text-white px-3 py-2 rounded-3 fw-semibold"
                  style={{ backgroundColor: 'var(--main-color)' }}
                  to="/login"
                >
                  <i className="fa-solid fa-user-lock me-1"></i> Login
                </NavLink>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
