import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/Button';
import { useAuth } from '../hooks/useAuth';
import './Auth.css';

export const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    if (name && email && password) {
      const res = await signup(name, email, password);
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
        <div className="text-6xl mb-2 bounce-animation">🦅</div>
        <h1 className="text-3xl font-extrabold text-primary m-0">Create Profile</h1>
        <p className="text-muted font-bold text-md mt-1">Join the voter community!</p>
      </div>

      {error && <div className="text-danger font-bold mb-4 bg-danger/10 p-3 rounded-lg border-2 border-danger text-center animate-pop">{error}</div>}

      <form onSubmit={handleSignup} className="w-full max-w-[400px] flex flex-col gap-4 animate-slide-up stagger-2">
        <div className="form-group">
          <input 
            type="text" 
            className="auth-input w-full p-4 font-bold text-lg rounded-2xl border-2 border-border border-b-4 focus:border-secondary focus:outline-none transition-all"
            placeholder="Display Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
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
          SIGN UP
        </Button>

        <div className="text-center mt-4">
          <p className="text-muted font-bold">
            Already have an account? <Link to="/login" className="text-secondary hover:text-secondary-shadow">Log In</Link>
          </p>
        </div>
      </form>
    </div>
  );
};
