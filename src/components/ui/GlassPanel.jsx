export default function GlassPanel({ children, className = '', glow = false }) {
  return (
    <div className={`glass-panel ${glow ? 'glass-panel-glow' : ''} ${className}`}>
      {children}
    </div>
  );
}