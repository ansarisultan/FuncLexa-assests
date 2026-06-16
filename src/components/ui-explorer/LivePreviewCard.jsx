import { memo } from 'react';

const LivePreviewCard = memo(function LivePreviewCard({ params }) {
  const { bgOpacity, blur, borderWidth, borderOpacity, shadowSize, shadowOpacity, radius, gradientStart, gradientStop, gradientAngle } = params;

  const cardStyle = {
    backgroundColor: `rgba(15, 23, 42, ${bgOpacity})`,
    backdropFilter: blur > 0 ? `blur(${blur}px)` : 'none',
    WebkitBackdropFilter: blur > 0 ? `blur(${blur}px)` : 'none',
    border: borderWidth > 0 ? `${borderWidth}px solid rgba(148,163,184,${borderOpacity})` : 'none',
    boxShadow: shadowSize > 0 ? `0 ${shadowSize}px ${shadowSize * 2}px rgba(0,0,0,${shadowOpacity})` : 'none',
    borderRadius: `${radius}px`,
    background: `linear-gradient(${gradientAngle}deg, ${gradientStart}33, ${gradientStop}33)`,
    padding: '2rem',
    transition: 'all 0.15s ease-out',
  };

  return (
    <div className="flex justify-center">
      <div style={cardStyle} className="w-full max-w-sm text-center">
        <div className="text-xl font-semibold text-white bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
          Your Component
        </div>
        <p className="text-slate-400 mt-2 text-sm">This preview updates in real‑time.</p>
        <div className="mt-4 flex justify-center gap-3">
          <span className="inline-block w-2 h-2 rounded-full bg-accent-cyan animate-pulse" />
          <span className="inline-block w-2 h-2 rounded-full bg-brand-400 animate-pulse [animation-delay:0.2s]" />
          <span className="inline-block w-2 h-2 rounded-full bg-accent-violet animate-pulse [animation-delay:0.4s]" />
        </div>
      </div>
    </div>
  );
});

export default LivePreviewCard;