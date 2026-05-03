import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, BookOpen, MessageCircle, User } from 'lucide-react';
import './BottomNav.css';

export const BottomNav = () => {
  return (
    <nav className="bottom-nav bg-surface">
      <div className="bottom-nav-content">
        <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Home size={24} />
          <span>Home</span>
        </NavLink>
        <NavLink to="/learn" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <BookOpen size={24} />
          <span>Learn</span>
        </NavLink>
        <NavLink to="/chat" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <MessageCircle size={24} />
          <span>Chat</span>
        </NavLink>
        <NavLink to="/profile" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <User size={24} />
          <span>Profile</span>
        </NavLink>
      </div>
    </nav>
  );
};
