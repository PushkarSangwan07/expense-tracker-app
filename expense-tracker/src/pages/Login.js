import './LoginButton.css';
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const LoginButton = () => {
  const navigate = useNavigate();
  const { user, loginWithRedirect, isAuthenticated, logout, isLoading } = useAuth0();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard'); 
    }
  }, [isAuthenticated, navigate]);

  if (isLoading) {
    return <div className="login-container">Loading...</div>;
  }

  return (
    <div className="login-page">
      {!isAuthenticated ? (
        <div className="login-card">
          <h1 className="login-title">Welcome to Expense Tracker 💰</h1>
          <p className="login-subtitle">Track your income & expenses effortlessly</p>
          <button
            className="login-btn"
            onClick={() => loginWithRedirect({ screen_hint: 'signup' })}
          >
            Register / Sign In
          </button>
        </div>
      ) : (
        <div className="user-card">
          <img className="user-avatar" src={user.picture} alt={user.name} />
          <h2 className="user-name">{user.name}</h2>
          <p className="user-email">{user.email}</p>
          <div className="user-actions">
            <button
              className="logout-btn"
              onClick={() => logout({ returnTo: window.location.origin })}
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginButton;
