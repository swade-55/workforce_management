import React, { useState } from 'react';
import { Link, useNavigate, Outlet } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../slices/authSlice';
import Breadcrumbs from './Breadcrumbs';
import 'bootstrap/dist/css/bootstrap.min.css';

const SidebarLayout = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const auth = useSelector((state) => state.auth);
  console.log('this is auth for sidebar layout', auth)
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUser())
      .then(() => {
        console.log('Logout successful');
        navigate('/login');
      })
      .catch((error) => console.error('Logout failed', error));
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <aside
        style={{
          width: '16rem',
          backgroundColor: '#1f2937',
          color: '#fff',
          height: '100%',
          position: 'fixed',
          padding: '0',
          margin: '0',
          overflow: 'auto'
        }}
      >
        <div style={{ padding: '1rem', fontSize: '2xl', fontWeight: 'bold' }}>
          <img src="/nokialogo.png" alt="Nokia Logo" style={{ width: '50%', height: 'auto' }} />
        </div>
        <nav>
          <ul style={{ listStyleType: 'none', padding: '0', margin: '0' }}>
            <li style={{ borderBottom: '1px solid #2d3748' }}>
              <div
                onClick={toggleDropdown}
                style={{
                  display: 'block',
                  padding: '0.75rem 1rem',
                  color: '#fff',
                  background: 'none',
                  border: 'none',
                  width: '100%',
                  textAlign: 'left',
                  cursor: 'pointer'
                }}
              >
                Assets/Stock
                <span style={{ float: 'right' }}>{isDropdownOpen ? '▲' : '▼'}</span>
              </div>
              {isDropdownOpen && (
                <ul style={{ listStyleType: 'none', padding: '0', margin: '0' }}>
                  <li style={{ borderBottom: '1px solid #2d3748' }}>
                    <Link
                      to="/asset-container"
                      style={{
                        display: 'block',
                        padding: '0.75rem 1rem',
                        color: '#fff',
                        textDecoration: 'none'
                      }}
                    >
                      Asset Container
                    </Link>
                  </li>
                  <li style={{ borderBottom: '1px solid #2d3748' }}>
                    <Link
                      to="/stock-container"
                      style={{
                        display: 'block',
                        padding: '0.75rem 1rem',
                        color: '#fff',
                        textDecoration: 'none'
                      }}
                    >
                      Stock Container
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            <li style={{ borderBottom: '1px solid #2d3748' }}>
              <Link
                to="/manage-test-lines"
                style={{
                  display: 'block',
                  padding: '0.75rem 1rem',
                  color: '#fff',
                  textDecoration: 'none'
                }}
              >
                Manage All Test Lines
              </Link>
            </li>
            {auth.user && auth.user.role === 'admin' && (
              <li style={{ borderBottom: '1px solid #2d3748' }}>
                <Link
                  to="/manage-users"
                  style={{
                    display: 'block',
                    padding: '0.75rem 1rem',
                    color: '#fff',
                    textDecoration: 'none'
                  }}
                >
                  Manage Users
                </Link>
              </li>
            )}
            <li style={{ borderBottom: '1px solid #2d3748' }}>
              <button
                onClick={handleLogout}
                style={{
                  display: 'block',
                  padding: '0.75rem 1rem',
                  color: '#fff',
                  textDecoration: 'none',
                  width: '100%',
                  textAlign: 'left',
                  background: 'none',
                  border: 'none'
                }}
              >
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </aside>
      <div style={{ marginLeft: '16rem', width: 'calc(100% - 16rem)' }}>
        <header style={{ backgroundColor: '#f3f4f6', padding: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1 style={{ fontSize: '2xl', fontWeight: 'bold' }}>Dashboard</h1>
            <div style={{ color: '#4b5563' }}>Welcome {auth.user.username}!</div>
          </div>
        </header>
        <main style={{ padding: '1rem' }}>
          <Breadcrumbs />
          <Outlet />
        </main>
        <footer style={{ backgroundColor: '#f3f4f6', padding: '1rem', textAlign: 'center' }}>
          <p>© 2024 Nokia One Lab</p>
        </footer>
      </div>
    </div>
  );
};

export default SidebarLayout;
