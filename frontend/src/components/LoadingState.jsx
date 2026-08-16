import React, { useEffect, useState } from 'react';
import { Loader2, Search, DownloadCloud, BrainCircuit, CheckCircle2 } from 'lucide-react';

const STAGES = [
  { text: 'Discovering applications across Apple App Store & Google Play...', icon: Search },
  { text: 'Validating publisher identifiers and matching organization profile...', icon: CheckCircle2 },
  { text: 'Collecting recent customer reviews and ratings...', icon: DownloadCloud },
  { text: 'Performing VADER sentiment analysis & theme categorization...', icon: BrainCircuit },
  { text: 'Calculating cross-platform metrics and compiling dashboard...', icon: CheckCircle2 },
];

export default function LoadingState({ query = 'Organization', message }) {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStageIndex((prev) => (prev < STAGES.length - 1 ? prev + 1 : prev));
    }, 1600);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '80px 20px',
      minHeight: '400px',
      textAlign: 'center',
    }}>
      {/* Animated Glowing Orb */}
      <div style={{
        position: 'relative',
        width: '88px',
        height: '88px',
        borderRadius: '50%',
        background: 'rgba(99, 102, 241, 0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '28px',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        boxShadow: '0 0 35px rgba(99, 102, 241, 0.3)',
      }}>
        <Loader2 size={40} color="#6366F1" className="animate-spin" />
      </div>

      <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '8px' }}>
        Analyzing <span style={{ color: '#818CF8' }}>"{query}"</span>
      </h3>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '500px', marginBottom: '32px' }}>
        {message || 'Our intelligence pipeline is querying official store APIs and processing user sentiment in real-time.'}
      </p>

      {/* Progress Steps */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        width: '100%',
        maxWidth: '480px',
        background: 'rgba(15, 23, 42, 0.6)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        padding: '20px',
        backdropFilter: 'blur(12px)',
      }}>
        {STAGES.map((stage, idx) => {
          const isDone = idx < currentStageIndex;
          const isCurrent = idx === currentStageIndex;
          const StageIcon = stage.icon;

          return (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontSize: '0.875rem',
                color: isDone ? '#10B981' : isCurrent ? '#FFFFFF' : 'var(--text-dim)',
                fontWeight: isCurrent ? 600 : 400,
                transition: 'all 0.3s ease',
              }}
            >
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: isDone ? 'rgba(16, 185, 129, 0.2)' : isCurrent ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                border: isDone ? '1px solid #10B981' : isCurrent ? '1px solid #6366F1' : '1px solid rgba(255, 255, 255, 0.1)',
              }}>
                {isDone ? (
                  <CheckCircle2 size={14} color="#10B981" />
                ) : isCurrent ? (
                  <Loader2 size={14} color="#818CF8" className="animate-spin" />
                ) : (
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{idx + 1}</span>
                )}
              </div>
              <span style={{ textAlign: 'left', flex: 1 }}>{stage.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
