import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Mascot } from '../components/Mascot';
import { CheckCircle2, Lock, Star } from 'lucide-react';
import { useProgress } from '../hooks/useProgress';
import './Home.css';

const steps = [
  { id: 1, title: 'Check Eligibility' },
  { id: 2, title: 'Register as Voter' },
  { id: 3, title: 'Verify Voter ID' },
  { id: 4, title: 'Find Constituency' },
  { id: 5, title: 'Voting Process' },
  { id: 6, title: 'Results' },
];

export const Home = () => {
  const [age, setAge] = useState('');
  const [citizenship, setCitizenship] = useState('yes');
  const [eligibility, setEligibility] = useState(null);
  
  // Real progress state
  const [currentStep, setCurrentStep] = useProgress('votewise_step', 0);
  const [animatingStep, setAnimatingStep] = useState(null);

  const handleNodeClick = (idx) => {
    if (idx === currentStep) {
      setAnimatingStep(idx);
      setTimeout(() => {
        setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
        setAnimatingStep(null);
      }, 400); // Wait for animation
    }
  };

  const checkEligibility = (e) => {
    e.preventDefault();
    if (age >= 18 && citizenship === 'yes') {
      setEligibility({ status: 'eligible', message: 'You are eligible to vote! 🎉 +10 XP' });
    } else {
      setEligibility({ status: 'ineligible', message: 'You must be 18+ and a citizen to vote.' });
    }
  };

  return (
    <div className="home-page">
      <Mascot message="Great job practicing! You're on a 3-day streak! 🔥 Keep it up!" />
      
      <section className="eligibility-section mb-6">
        <Card className="bg-primary/10 border-primary">
          <h2 className="text-xl font-extrabold mb-3 text-center">Eligibility Checker</h2>
          <form onSubmit={checkEligibility} className="flex flex-col gap-3">
            <div className="flex gap-2">
              <div className="form-group flex-1">
                <label className="text-sm font-bold block mb-1">Age</label>
                <input 
                  type="number" 
                  className="input-field" 
                  value={age} 
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="18"
                  required
                />
              </div>
              <div className="form-group flex-1">
                <label className="text-sm font-bold block mb-1">Citizen?</label>
                <select 
                  className="input-field" 
                  value={citizenship} 
                  onChange={(e) => setCitizenship(e.target.value)}
                >
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>
            </div>
            <Button type="submit" fullWidth className="mt-1">Check Now</Button>
          </form>

          {eligibility && (
            <div className={`mt-3 p-3 rounded-xl font-bold text-center border-2 border-b-4 ${
              eligibility.status === 'eligible' ? 'bg-primary border-primary-shadow text-white' : 'bg-danger border-danger-shadow text-white'
            }`}>
              {eligibility.message}
            </div>
          )}
        </Card>
      </section>

      <section className="journey-section pb-8">
        <h2 className="text-2xl font-extrabold mb-6 text-center">Your Voting Path</h2>
        
        <div className="level-path relative flex flex-col items-center gap-6">
          {steps.map((step, idx) => {
            const isCompleted = idx < currentStep;
            const isActive = idx === currentStep;
            const isLocked = idx > currentStep;
            
            // Calculate an alternating horizontal offset
            // Modulo math ensures we swing left, center, right, center, left
            const offsets = [0, 60, 0, -60];
            const offset = offsets[idx % offsets.length];

            return (
              <div 
                key={step.id} 
                className="path-node-wrapper relative"
                style={{ transform: `translateX(${offset}px)` }}
              >
                {/* Connection Line to next node (don't draw for last node) */}
                {idx < steps.length - 1 && (
                  <svg className="path-connection absolute -z-10" width="120" height="80" style={{
                    top: '50px',
                    left: offset < 0 ? '50px' : (offset > 0 ? '-30px' : '30px'),
                    strokeDasharray: '8 8',
                    strokeWidth: '4',
                    stroke: isCompleted ? 'var(--primary)' : 'var(--border)'
                  }}>
                    <path d={
                      offset === 0 ? "M30 0 C30 40, 80 40, 80 80" :
                      offset > 0 ? "M10 0 C10 40, -40 40, -40 80" :
                      "M60 0 C60 40, 110 40, 110 80"
                    } fill="transparent" />
                  </svg>
                )}

                {/* Floating tooltip for active step */}
                {isActive && (
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-surface border-2 border-border border-b-4 px-3 py-2 rounded-xl text-sm font-bold whitespace-nowrap z-10 bounce-animation tooltip-arrow">
                    {step.title}
                  </div>
                )}

                <button 
                  className={`path-node w-20 h-20 rounded-full border-4 flex items-center justify-center relative transition-transform ${
                    animatingStep === idx ? 'animate-pop' : ''
                  } ${
                    isCompleted ? 'bg-primary border-primary-shadow text-white cursor-default' : 
                    isActive ? 'bg-warning border-warning-shadow text-white scale-110 shadow-lg ring-4 ring-warning/30 hover:scale-110 active:scale-95' : 
                    'bg-surface border-border text-muted cursor-not-allowed'
                  }`}
                  disabled={isLocked || isCompleted}
                  onClick={() => handleNodeClick(idx)}
                >
                  <div className="absolute top-0 bottom-0 left-0 right-0 rounded-full bg-white/20 h-1/2 rounded-b-none mt-1 mx-2" />
                  {isCompleted ? (
                    <CheckCircle2 size={36} fill="white" className="text-primary-shadow" />
                  ) : isActive ? (
                    <Star size={36} fill="white" className="text-warning-shadow bounce-animation" />
                  ) : (
                    <Lock size={32} />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
