import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AuthModal.css';
import { auth } from '../services/firebase/index.js'; // Adjust the import based on your project structure
import {
  signInWithEmail,
  signInWithGoogle,
  createAccount,
  signOutUser,
  getIdToken,
  sendPasswordReset,
} from '../services/authService.js';
import { useAuth } from '../contexts/AuthContext.jsx';
import { sendTokenToBackend } from '../services/userService.js';



const AuthModal = ({ onClose, mode = 'login' }) => {
  const [isLogin, setIsLogin] = useState(mode === 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [resetMode, setResetMode] = useState(false);
  const { setUserProfile, setIsSigningUp } = useAuth();


  useEffect(() => {
    setIsLogin(mode === 'login');
  }, [mode]);

  const validateForm = () => {
    setError('');
    if (!email || !email.includes('@')) return setError('Please enter a valid email address') || false;
    if (!resetMode && !password) return setError('Please enter your password') || false;
    if (!isLogin && !resetMode) {
      if (password.length < 8) return setError('Password must be at least 8 characters') || false;
      if (password !== confirmPassword) return setError('Passwords do not match') || false;
      if (!name.trim()) return setError('Please enter your name') || false;
    }
    return true;
  };

  const handleAuthAction = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    setError('');
    setSuccessMsg('');
  
    try {
      let result;
      if (resetMode) {
        result = await sendPasswordReset(email);
        if (!result.success) {
          setError(result.error);
          return;
        }
        setSuccessMsg('Password reset email sent!');
        setResetMode(false);
        setLoading(false);
        return;
      } else if (isLogin) {
        result = await signInWithEmail(email, password);
      } else {
        setIsSigningUp(true); // Set the flag to true during sign-up
        result = await createAccount(email, password);
      }
  
      if (!result.success) {
        setError(result.error);
        return;
      } else {
        const tokenResp = await getIdToken();
        if (!tokenResp.success) throw new Error("Token fetch failed");
        
        //!! ------- Debugging ------
        console.log("📍------------📍------------📍-----------📍");
        console.log("📍 Auth Result:", result);
        console.log("📍 Token:", tokenResp.token);

        //!! ------- Debugging ------
        const token = tokenResp.token;
        try {
          const profile = await sendTokenToBackend(token, {
            isLogin,
            additionalData: !isLogin ? { name } : {},
          });
        
          // setUserProfile(profile); // ✅ Only if successful
          // console.log("✅ Profile received from backend:", profile);
          console.log("📍------------📍------------📍-----------📍");
          onClose();
        } catch (err) {
          console.error("Auth error:", err.message);
          setError(err.message); // show in your UI
        }
      }
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
      setIsSigningUp(false); // Reset the flag after sign-up
    }
  };
  

const handleGoogleSignIn = async () => {
  setLoading(true);
  setError('');
  try {
    // Sign in with Google
    const result = await signInWithGoogle();
    if (!result.success) {
      setError(result.error);
      return;
    }
    
    // Get the ID token
    const tokenResp = await getIdToken();
    if (!tokenResp.success) throw new Error("Token fetch failed");

    // Check if the user is new
    const isNewUser = result.user.metadata.creationTime === result.user.metadata.lastSignInTime;

    console.log("📍📍📍📍📍📍📍📍###########📍📍📍📍📍");
    console.log("📍 Google Sign-In Result:", result);
    console.log("📍 Is New User:", isNewUser);

    console.log("📍📍📍📍📍📍📍📍###########📍📍📍📍📍");

    // Send token to backend with name only if the user is new
    const profile = await sendTokenToBackend(tokenResp.token, {
      isLogin: !isNewUser, // If not new, treat as login
      additionalData: isNewUser ? { name: result.user.displayName } : {}, // Send name only for new users
    });

    onClose(); // Close the modal
  } catch (err) {
    console.error('Google sign-in error:', err);
    setError(err.message || 'An unexpected error occurred.');
  } finally {
    setLoading(false);
  }
};
  

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setResetMode(false);
    setError('');
    setSuccessMsg('');
  };

  const toggleResetMode = () => {
    setResetMode(!resetMode);
    setError('');
    setSuccessMsg('');
  };

  return (
    <div className="auth-modal-backdrop">
      <div className="auth-container">
        <div className="auth-card card">
          <button className="auth-close-button" onClick={onClose}>×</button>
          <div className="auth-header">
            <img src="/logo.svg" alt="Halal Hub Logo" className="auth-logo" />
            <h1>{resetMode ? 'Reset Password' : (isLogin ? 'Welcome Back' : 'Create Account')}</h1>
            <p className="auth-subtitle">
              {resetMode ? 'Enter your email to reset password' : isLogin ? 'Sign in to Halal Hub' : 'Join our halal community'}
            </p>
          </div>

          {error && <div className="error-message">{error}</div>}
          {successMsg && <div className="success-message">{successMsg}</div>}

          <form onSubmit={handleAuthAction} className="auth-form">
            {!isLogin && !resetMode && (
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input id="name" type="text" className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" required />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input id="email" type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" required />
            </div>

            {!resetMode && (
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input id="password" type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
                {!isLogin && <div className="password-requirements">Minimum 8 characters</div>}
              </div>
            )}

            {!isLogin && !resetMode && (
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input id="confirmPassword" type="password" className="input" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" required />
              </div>
            )}

            <button type="submit" className={`btn btn-primary auth-submit ${loading ? 'loading' : ''}`} disabled={loading}>
              {loading ? 'Processing...' : resetMode ? 'Send Reset Link' : isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {!resetMode && (
            <>
              <div className="auth-divider"><span>OR</span></div>
              <button onClick={handleGoogleSignIn} className="btn btn-secondary auth-google" disabled={loading}>
                <img src="/google-icon.svg" alt="Google" className="google-icon" /> Continue with Google
              </button>
            </>
          )}

          <div className="auth-footer">
            {isLogin && !resetMode && <button onClick={toggleResetMode} className="auth-text-button reset-password">Forgot password?</button>}
            {resetMode && <button onClick={toggleResetMode} className="auth-text-button">Back to login</button>}
            {!resetMode && <button onClick={toggleAuthMode} className="auth-text-button">{isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}</button>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;