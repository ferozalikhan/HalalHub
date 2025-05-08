import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/AuthModal.css';
import { auth } from '../firebase/index.js'; // Adjust the import based on your project structure
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail
} from 'firebase/auth';

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

  const navigate = useNavigate();
  const googleProvider = new GoogleAuthProvider();

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
    try {
      if (resetMode) {
        await sendPasswordResetEmail(auth, email);
        setSuccessMsg('Password reset email sent!');
        setResetMode(false);
      } else if (isLogin) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const idToken = await userCredential.user.getIdToken();
        await sendTokenToBackend(idToken);
        navigate('/dashboard');
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const idToken = await userCredential.user.getIdToken();
        await sendTokenToBackend(idToken, { name });
        navigate('/welcome');
      }
    } catch (err) {
      console.error('Auth error:', err);
      setError(getReadableErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      await sendTokenToBackend(idToken);
      navigate('/dashboard');
    } catch (err) {
      console.error('Google sign-in error:', err);
      setError(getReadableErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  const sendTokenToBackend = async (token, additionalData = {}) => {
    const response = await fetch('YOUR_BACKEND_API_URL/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(additionalData)
    });
    if (!response.ok) throw new Error('Failed to authenticate with server');
    return await response.json();
  };

  const getReadableErrorMessage = (errorCode) => {
    const messages = {
      'auth/user-not-found': 'No account found with this email',
      'auth/wrong-password': 'Incorrect password',
      'auth/email-already-in-use': 'Email already in use',
      'auth/weak-password': 'Password is too weak',
      'auth/invalid-email': 'Invalid email format',
      'auth/too-many-requests': 'Too many attempts, try again later'
    };
    return messages[errorCode] || 'An unexpected error occurred';
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