import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import Terminal from '../components/ui/Terminal';

const defaultStyles = {
  bg: '#1E293B',
  text: '#FFFFFF',
  padding: '2rem',
  borderRadius: '1rem',
  shadow: '0 8px 32px rgba(0,0,0,0.4)',
  border: '1px solid rgba(148,163,184,0.2)',
  width: '100%',
  maxWidth: '400px',
};

export default function UIMaker() {
  const [styles, setStyles] = useState(defaultStyles);
  const [copied, setCopied] = useState(false);

  const handleChange = (key, value) => {
    setStyles(prev => ({ ...prev, [key]: value }));
  };

  const generateCode = () => {
    const styleString = Object.entries(styles)
      .map(([k, v]) => `${k.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${v};`)
      .join('\n  ');
    return `<div style="\n  ${styleString}\n">\n  <h3>Your Component</h3>\n  <p>Styled with UI Maker</p>\n</div>`;
  };

  const code = generateCode();

  const copyCode = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="space-y-6 animate-fade-up">
      <h1 className="text-2xl font-bold tracking-tight text-white">UI Maker</h1>
      <p className="text-slate-400">Design custom UI components in real‑time and export the code.</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <div className="glass-panel p-6 space-y-4">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Style Controls</h2>
          <div className="space-y-3">
            <Control label="Background" type="color" value={styles.bg} onChange={(v) => handleChange('bg', v)} />
            <Control label="Text Color" type="color" value={styles.text} onChange={(v) => handleChange('text', v)} />
            <Control label="Padding" type="text" value={styles.padding} onChange={(v) => handleChange('padding', v)} />
            <Control label="Border Radius" type="text" value={styles.borderRadius} onChange={(v) => handleChange('borderRadius', v)} />
            <Control label="Shadow" type="text" value={styles.shadow} onChange={(v) => handleChange('shadow', v)} />
            <Control label="Border" type="text" value={styles.border} onChange={(v) => handleChange('border', v)} />
            <Control label="Width" type="text" value={styles.width} onChange={(v) => handleChange('width', v)} />
            <Control label="Max Width" type="text" value={styles.maxWidth} onChange={(v) => handleChange('maxWidth', v)} />
          </div>
          <button 
            onClick={() => setStyles(defaultStyles)}
            className="mt-2 text-sm text-slate-400 hover:text-white transition-colors"
          >
            Reset to defaults
          </button>
        </div>

        {/* Live Preview */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6 flex justify-center items-center min-h-[200px]">
            <div style={styles} className="text-center">
              <h3 className="text-xl font-semibold" style={{ color: styles.text }}>Your Component</h3>
              <p className="mt-2" style={{ color: styles.text, opacity: 0.7 }}>Styled with UI Maker</p>
            </div>
          </div>

          {/* Code with copy */}
          <div className="glass-panel overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800/60">
              <span className="text-xs font-mono text-slate-400">Generated HTML</span>
              <button
                onClick={copyCode}
                className="flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
            <pre className="p-4 text-sm font-mono text-green-300 overflow-x-auto whitespace-pre-wrap">
              {code}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

function Control({ label, type, value, onChange }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-slate-400">{label}</label>
      {type === 'color' ? (
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-12 h-8 rounded border border-slate-700 bg-transparent cursor-pointer"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="bg-slate-800/60 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-brand-400"
        />
      )}
    </div>
  );
}
