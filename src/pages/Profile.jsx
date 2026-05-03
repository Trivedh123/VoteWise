import React from 'react';
import { Card } from '../components/Card';
import { User, Award, MapPin, ChevronRight, Bell, Globe, LogOut } from 'lucide-react';
import { useProgress } from '../hooks/useProgress';
import { useLocation } from '../hooks/useLocation';
import { useAuth } from '../hooks/useAuth';
import './Profile.css';

export const Profile = () => {
  const [currentStep, , syncedData] = useProgress('votewise_step', 0);
  const { location } = useLocation();
  const { logout, user } = useAuth();
  
  const streak = syncedData?.streak || 0;
  const gems = syncedData?.gems || 0;
  const displayName = user?.name || 'Voter 101';

  return (
    <div className="profile-page pb-8">
      {/* Header */}
      <div className="profile-header flex flex-col items-center pt-8 pb-4">
        <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center text-white mb-4 border-b-4 border-secondary-shadow">
          <User size={48} />
        </div>
        <h2 className="text-2xl font-extrabold m-0 mb-1">{displayName}</h2>
        <p className="text-muted font-bold flex items-center gap-1">
          <MapPin size={16} /> {location || 'Unknown Location'}
        </p>
      </div>

      {/* Simple Stats Card */}
      <section className="px-4 mb-6">
        <Card className="flex justify-around py-4">
          <div className="text-center">
            <div className="text-2xl font-extrabold text-danger mb-1">{streak}</div>
            <div className="text-xs font-bold text-muted uppercase">Day Streak</div>
          </div>
          <div className="w-px bg-border"></div>
          <div className="text-center">
            <div className="text-2xl font-extrabold text-secondary mb-1">{gems}</div>
            <div className="text-xs font-bold text-muted uppercase">Gems</div>
          </div>
        </Card>
      </section>

      {/* Achievements */}
      <section className="px-4 mb-6">
        <h3 className="text-lg font-bold mb-3 px-1">Achievements</h3>
        <div className="flex flex-col gap-3">
          <Card className="flex items-center gap-4 bg-surface">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
              <Award size={24} />
            </div>
            <div>
              <h4 className="font-bold m-0 text-main">First Steps</h4>
              <p className="text-sm text-muted m-0">Started your journey</p>
            </div>
          </Card>
          
          {currentStep >= 1 && (
            <Card className="flex items-center gap-4 bg-surface animate-fade-in">
              <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center text-secondary">
                <span className="text-xl">✅</span>
              </div>
              <div>
                <h4 className="font-bold m-0 text-main">Eligibility Checked</h4>
                <p className="text-sm text-muted m-0">You're ready to register</p>
              </div>
            </Card>
          )}
        </div>
      </section>

      {/* Settings */}
      <section className="px-4">
        <h3 className="text-lg font-bold mb-3 px-1">Settings</h3>
        <Card className="p-0 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b-2 border-border cursor-pointer hover:bg-background transition-colors">
            <div className="flex items-center gap-3 font-bold">
              <Globe size={20} className="text-muted" /> Language
            </div>
            <div className="flex items-center gap-1 text-muted">
              <span className="text-sm font-bold text-secondary">English</span>
              <ChevronRight size={16} />
            </div>
          </div>
          <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-background transition-colors">
            <div className="flex items-center gap-3 font-bold">
              <Bell size={20} className="text-muted" /> Notifications
            </div>
            <div className="flex items-center gap-1 text-muted">
              <span className="text-sm font-bold text-primary">On</span>
              <ChevronRight size={16} />
            </div>
          </div>
        </Card>
      </section>

      {/* Logout */}
      <section className="px-4 mt-6">
        <button 
          onClick={logout}
          className="w-full p-4 rounded-2xl bg-surface border-2 border-border border-b-4 text-danger font-extrabold flex items-center justify-center gap-2 active:border-b-2 active:translate-y-1 transition-all"
        >
          <LogOut size={20} />
          LOG OUT
        </button>
      </section>
    </div>
  );
};
