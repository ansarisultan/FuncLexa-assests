import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Copy, Check, Star, Maximize2, X, Layers, Sparkles } from 'lucide-react';

export default function ComponentCard({ 
  component, 
  isTheme = false, 
  isFavorite = false, 
  onToggleFavorite 
}) {
  const [copied, setCopied] = useState(false);
  const [copiedCSS, setCopiedCSS] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const copyCode = () => {
    const codeToCopy = component.code || `<div className="${component.preview}">${component.name}</div>`;
    navigator.clipboard.writeText(codeToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  const copyCSSVariables = () => {
    if (component.cssVariables) {
      const cssString = Object.entries(component.cssVariables)
        .map(([key, value]) => `${key}: ${value};`)
        .join('\n  ');
      navigator.clipboard.writeText(`:root {\n  ${cssString}\n}`).then(() => {
        setCopiedCSS(true);
        setTimeout(() => setCopiedCSS(false), 1500);
      });
    }
  };

  return (
    <>
      <div 
        className="panel-3d p-4 group cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setShowModal(true)}
      >
        {/* Preview with overlay */}
        <div className="rounded-xl flex items-center justify-center min-h-[120px] text-center relative overflow-hidden bg-[#0A0A0F]/60 border border-white/10">
          {component.image ? (
            <img 
              src={component.image} 
              alt={component.name} 
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
            />
          ) : (
            <div className={`${component.preview} w-full h-full min-h-[120px] flex items-center justify-center p-4`}>
              <span className="text-xs font-medium max-w-full truncate">{component.name}</span>
            </div>
          )}
          
          {/* Hover overlay with glow */}
          <div className={`absolute inset-0 bg-gradient-to-br from-primary-500/20 via-secondary-500/10 to-transparent transition-opacity duration-500 z-10 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`} />
          
          <div className={`absolute inset-0 flex items-center justify-center gap-2 transition-all duration-500 z-20 ${
            isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
          }`}>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-full border border-white/10">
              <Maximize2 className="w-3.5 h-3.5 text-white" />
              <span className="text-xs text-white font-medium">View Details</span>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="mt-3 flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-white truncate">{component.name}</h3>
            <div className="flex flex-wrap gap-1 mt-1">
              <span className="text-[10px] text-slate-400 bg-white/5 px-2 py-0.5 rounded-full">{component.category}</span>
              {component.type && (
                <span className="text-[10px] text-secondary-400 bg-secondary-500/10 px-2 py-0.5 rounded-full border border-secondary-500/20">
                  {component.type}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1 ml-2 flex-shrink-0">
            <button
              onClick={(e) => { 
                e.stopPropagation(); 
                onToggleFavorite(); 
              }}
              className="p-1.5 rounded-lg hover:bg-white/5 transition-all duration-300 hover:scale-110"
            >
              <Star className={`w-3.5 h-3.5 transition-all duration-300 ${
                isFavorite ? 'text-warm-400 fill-warm-400' : 'text-slate-500 hover:text-warm-400'
              }`} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); copyCode(); }}
              className="p-1.5 rounded-lg hover:bg-white/5 transition-all duration-300 hover:scale-110"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-green-400" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-slate-400 hover:text-white" />
              )}
            </button>
          </div>
        </div>

        {component.description && (
          <p className="text-xs text-slate-400 mt-1.5 line-clamp-1">{component.description}</p>
        )}
      </div>

      {/* Premium Modal */}
      {showModal && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl" onClick={() => setShowModal(false)}>
          <div className="panel-3d max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-scale-in" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="sticky top-0 bg-[#0F172A]/95 backdrop-blur-xl border-b border-white/10 p-5 flex items-center justify-between z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.2)]">
                  <Layers className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gradient-cyber">{component.name}</h2>
                  <div className="flex gap-2 mt-0.5">
                    <span className="text-xs text-slate-400">{component.category}</span>
                    {component.type && (
                      <span className="text-xs text-secondary-400 bg-secondary-500/10 px-2 py-0.5 rounded-full border border-secondary-500/20">
                        {component.type}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={onToggleFavorite}
                  className="p-2 rounded-xl hover:bg-white/5 transition-all duration-300 hover:scale-110"
                >
                  <Star className={`w-5 h-5 transition-all duration-300 ${
                    isFavorite ? 'text-warm-400 fill-warm-400' : 'text-slate-400'
                  }`} />
                </button>
                <button onClick={() => setShowModal(false)} className="p-2 rounded-xl hover:bg-white/5 transition text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Description */}
              {component.description && (
                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <p className="text-sm text-slate-300">{component.description}</p>
                </div>
              )}

              {/* Live Preview */}
              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Live Preview</h4>
                <div className="p-4 rounded-xl flex items-center justify-center min-h-[220px] bg-[#0F172A]/50 border border-white/5 relative overflow-hidden">
                  {component.image ? (
                    <img 
                      src={component.image} 
                      alt={component.name} 
                      className="rounded-lg max-h-[300px] w-full object-contain z-10" 
                    />
                  ) : (
                    <div className={`${component.preview} w-full max-w-sm text-center relative z-10 p-8 rounded-xl`}>
                      <p className="text-lg font-medium text-white">{component.name}</p>
                      {component.type && (
                        <p className="text-sm text-slate-400 mt-1">{component.type} Design System</p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* CSS Variables */}
              {component.cssVariables && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">CSS Variables</h4>
                    <button 
                      onClick={copyCSSVariables}
                      className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1 transition"
                    >
                      {copiedCSS ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      {copiedCSS ? 'Copied!' : 'Copy All'}
                    </button>
                  </div>
                  <div className="bg-[#0A0A0F] border border-white/5 rounded-xl p-4 font-mono text-xs">
                    <pre className="text-green-300 overflow-auto whitespace-pre-wrap">
{`:root {\n  ${Object.entries(component.cssVariables).map(([key, value]) => `${key}: ${value};`).join('\n  ')}\n}`}
                    </pre>
                  </div>
                </div>
              )}

              {/* Tailwind Classes */}
              {component.tailwindClasses && (
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Tailwind CSS Classes</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(component.tailwindClasses).map(([key, value]) => (
                      <div key={key} className="bg-[#0F172A]/30 border border-white/5 rounded-xl p-2 hover:border-white/10 transition">
                        <span className="text-[10px] text-slate-500 block">{key}</span>
                        <div className="text-xs text-white font-mono truncate">{value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Usage & Best For */}
              {component.usage && (
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Usage</h4>
                  <p className="text-sm text-slate-300">{component.usage}</p>
                  {component.bestFor && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {component.bestFor.map(item => (
                        <span key={item} className="text-xs bg-gradient-to-r from-primary-500/10 to-secondary-500/10 text-primary-400 px-3 py-1 rounded-full border border-primary-500/20">
                          {item}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Code */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Code</h4>
                  <button 
                    onClick={copyCode}
                    className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1 transition"
                  >
                    <Copy className="w-3 h-3" /> Copy
                  </button>
                </div>
                <div className="bg-[#0A0A0F] border border-white/5 rounded-xl p-4">
                  <pre className="text-xs font-mono text-green-300 overflow-auto whitespace-pre-wrap">
                    {component.code || `<div className="${component.preview}">${component.name}</div>`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}