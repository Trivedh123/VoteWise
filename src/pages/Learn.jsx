import React from 'react';
import { Card } from '../components/Card';
import { BookOpen, Calendar, Vote, FileText, BarChart, CheckCircle2, MessageCircle, ChevronRight, Star } from 'lucide-react';
import './Learn.css';

const timelineEvents = [
  { id: 1, title: 'Registration Open', date: 'Jan 1 - Feb 28', icon: <FileText size={20} /> },
  { id: 2, title: 'Verification', date: 'March 1 - March 15', icon: <CheckCircle2 size={20} /> },
  { id: 3, title: 'Campaign Period', date: 'March 20 - April 10', icon: <MessageCircle size={20} /> },
  { id: 4, title: 'Voting Day', date: 'April 15', icon: <Vote size={20} />, highlight: true },
  { id: 5, title: 'Results', date: 'April 20', icon: <BarChart size={20} /> }
];

const learningModules = [
  { id: 1, title: 'What is EVM?', desc: 'Electronic Voting Machine explained', color: 'var(--secondary)' },
  { id: 2, title: 'Understanding NOTA', desc: 'None Of The Above option', color: 'var(--warning)' },
  { id: 3, title: 'How votes are counted', desc: 'The counting process demystified', color: 'var(--primary)' }
];

export const Learn = () => {
  return (
    <div className="learn-page">
      <section className="mb-6">
        <h2 className="text-2xl font-extrabold mb-4 animate-slide-up stagger-1">Election Timeline</h2>
        <div className="timeline-container relative pl-4 border-l-2 border-border ml-2">
          {timelineEvents.map((event, idx) => (
            <div key={event.id} className={`timeline-event mb-4 relative animate-slide-up stagger-${Math.min(idx + 1, 5)}`}>
              <div className={`timeline-icon absolute -left-[29px] w-6 h-6 rounded-full flex items-center justify-center text-white ${event.highlight ? 'bg-danger' : 'bg-secondary'}`}>
                {/* Scale icon down slightly for the timeline bubble */}
                <div style={{transform: 'scale(0.7)'}}>{event.icon}</div>
              </div>
              <Card className={`ml-4 ${event.highlight ? 'border-danger' : ''}`}>
                <h3 className="text-md font-bold m-0">{event.title}</h3>
                <p className="text-sm text-muted m-0">{event.date}</p>
              </Card>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-3 flex items-center gap-2 animate-slide-up stagger-2">
          <BookOpen size={24} className="text-primary" />
          Micro-Learning
        </h2>
        <div className="modules-grid flex gap-4 overflow-x-auto pb-4 no-scrollbar">
          {learningModules.map((module, idx) => (
            <div 
              key={module.id} 
              className={`module-book flex-shrink-0 w-32 relative cursor-pointer animate-slide-up stagger-${Math.min(idx + 3, 5)}`} 
              style={{ transform: idx === 1 ? 'translateY(-10px)' : 'none' }}
              onClick={() => alert(`Opening module: ${module.title}\n\n${module.desc}`)}
            >
              <div 
                className="book-cover h-40 rounded-lg border-2 border-border flex flex-col items-center justify-center p-2 text-center text-white"
                style={{ 
                  backgroundColor: module.color,
                  borderLeftWidth: '8px',
                  borderBottomWidth: '6px',
                  borderLeftColor: 'rgba(255,255,255,0.3)',
                  borderBottomColor: 'rgba(0,0,0,0.2)'
                }}
              >
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mb-2">
                  <Star size={20} fill="white" className="text-white" />
                </div>
                <h3 className="text-sm font-bold m-0 leading-tight">{module.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

