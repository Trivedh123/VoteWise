import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { useAuth } from '../hooks/useAuth';
import './Auth.css';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (email && password) {
      const res = await login(email, password);
      if (res.success) {
        navigate('/');
      } else {
        setError(res.error);
      }
    }
  };

  return (
    <div className="auth-page flex flex-col items-center justify-center p-4 min-h-[100vh]">
      <div className="text-center mb-8 animate-slide-up stagger-1">
        <div className="text-6xl mb-2 bounce-animation">🗳️</div>
        <h1 className="text-4xl font-extrabold text-primary m-0">VoteWise</h1>
        <p className="text-muted font-bold text-lg mt-1">Your election journey starts here.</p>
      </div>

      {error && <div className="text-danger font-bold mb-4 bg-danger/10 p-3 rounded-lg border-2 border-danger text-center animate-pop">{error}</div>}

      <form onSubmit={handleLogin} className="w-full max-w-[400px] flex flex-col gap-4 animate-slide-up stagger-2">
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
        <div className="form-group">
          <input 
            type="password" 
            className="auth-input w-full p-4 font-bold text-lg rounded-2xl border-2 border-border border-b-4 focus:border-secondary focus:outline-none transition-all"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <Button type="submit" fullWidth className="py-4 text-xl mt-2 rounded-2xl">
          LOG IN
        </Button>

        <div className="text-center mt-4">
          <p className="text-muted font-bold">
            Don't have an account? <Link to="/signup" className="text-secondary hover:text-secondary-shadow">Sign Up</Link>
          </p>
        </div>

        <div className="relative flex py-5 items-center">
          <div className="flex-grow border-t-2 border-border"></div>
          <span className="flex-shrink-0 mx-4 text-muted font-bold">OR</span>
          <div className="flex-grow border-t-2 border-border"></div>
        </div>

        <button 
          type="button" 
          className="auth-social-btn w-full p-4 font-bold text-lg rounded-2xl border-2 border-border border-b-4 bg-surface flex items-center justify-center gap-3 transition-transform hover:bg-background active:border-b-2 active:translate-y-1"
          onClick={() => { login(); navigate('/'); }}
        >
          <span className="text-xl">G</span> Continue with Google
        </button>
      </form>
    </div>
  );
};
