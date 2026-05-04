import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { useAuth } from '../hooks/useAuth';
import './Auth.css';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { forgotPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    const res = await forgotPassword(email);
    if (res.success) {
      setMessage('A reset link has been generated. Check the console (mock) or your email.');
    } else {
      setError(res.error);
    }
    setLoading(false);
  };

  return (
    <div className="auth-page flex flex-col items-center justify-center p-4 min-h-[100vh]">
      <div className="text-center mb-8 animate-slide-up stagger-1">
        <h1 className="text-4xl font-extrabold text-primary m-0">Reset Password</h1>
        <p className="text-muted font-bold text-lg mt-1">We'll help you get back in.</p>
      </div>

      {error && <div className="text-danger font-bold mb-4 bg-danger/10 p-3 rounded-lg border-2 border-danger text-center animate-pop">{error}</div>}
      {message && <div className="text-secondary font-bold mb-4 bg-secondary/10 p-3 rounded-lg border-2 border-secondary text-center animate-pop">{message}</div>}

      <form onSubmit={handleSubmit} className="w-full max-w-[400px] flex flex-col gap-4 animate-slide-up stagger-2">
        <div className="form-group">
          <input 
            type="email" 
            className="auth-input w-full p-4 font-bold text-lg rounded-2xl border-2 border-border border-b-4 focus:border-secondary focus:outline-none transition-all"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <Button type="submit" fullWidth className="py-4 text-xl mt-2 rounded-2xl" disabled={loading}>
          {loading ? 'SENDING...' : 'SEND RESET LINK'}
        </Button>

        <div className="text-center mt-4">
          <p className="text-muted font-bold">
            Remember your password? <Link to="/login" className="text-secondary hover:text-secondary-shadow">Log In</Link>
          </p>
        </div>
      </form>
    </div>
  );
};
