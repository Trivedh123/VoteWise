import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { useAuth } from '../hooks/useAuth';
import './Auth.css';

export const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }

    if (!token) {
      return setError('Invalid or missing token');
    }

    setLoading(true);
    const res = await resetPassword(token, password);
    if (res.success) {
      setMessage('Password reset successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 3000);
    } else {
      setError(res.error);
    }
    setLoading(false);
  };

  if (!token) {
    return (
      <div className="auth-page flex flex-col items-center justify-center p-4 min-h-[100vh]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-danger">Invalid Link</h1>
          <p className="text-muted mt-2">This password reset link is invalid or has expired.</p>
          <Link to="/forgot-password" virtual="true" className="text-secondary mt-4 block font-bold">Request a new one</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page flex flex-col items-center justify-center p-4 min-h-[100vh]">
      <div className="text-center mb-8 animate-slide-up stagger-1">
        <h1 className="text-4xl font-extrabold text-primary m-0">Set New Password</h1>
        <p className="text-muted font-bold text-lg mt-1">Make it strong and memorable.</p>
      </div>

      {error && <div className="text-danger font-bold mb-4 bg-danger/10 p-3 rounded-lg border-2 border-danger text-center animate-pop">{error}</div>}
      {message && <div className="text-secondary font-bold mb-4 bg-secondary/10 p-3 rounded-lg border-2 border-secondary text-center animate-pop">{message}</div>}

      <form onSubmit={handleSubmit} className="w-full max-w-[400px] flex flex-col gap-4 animate-slide-up stagger-2">
        <div className="form-group">
          <input 
            type="password" 
            className="auth-input w-full p-4 font-bold text-lg rounded-2xl border-2 border-border border-b-4 focus:border-secondary focus:outline-none transition-all"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <input 
            type="password" 
            className="auth-input w-full p-4 font-bold text-lg rounded-2xl border-2 border-border border-b-4 focus:border-secondary focus:outline-none transition-all"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        
        <Button type="submit" fullWidth className="py-4 text-xl mt-2 rounded-2xl" disabled={loading || !!message}>
          {loading ? 'RESETTING...' : 'RESET PASSWORD'}
        </Button>
      </form>
    </div>
  );
};
