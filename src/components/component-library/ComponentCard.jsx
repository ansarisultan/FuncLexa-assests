import { useState } from 'react';
import { Copy, Check, Star, Maximize2, X, Code, Palette, Layers, Sparkles } from 'lucide-react';

export default function ComponentCard({ 
  component, 
  isTheme = false, 
  isFavorite = false, 
  onToggleFavorite 
}) {
  const [copied, setCopied] = useState(false);
  const [showModal, setShowModal] = useState(false);

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
      navigator.clipboard.writeText(`:root {\n  ${cssString}\n}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <>
      <div 
        className="panel p-4 hover:border-white/20 transition-all duration-200 group cursor-pointer"
        onClick={() => setShowModal(true)}
      >
        {/* Preview */}
        <div className={`${component.preview} rounded-lg p-4 flex items-center justify-center min-h-[80px] text-center relative overflow-hidden`}>
          <span className="text-xs font-medium max-w-full truncate">{component.name}</span>
          
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
            <div className="flex items-center gap-2">
              <Maximize2 className="w-4 h-4 text-white" />
              <span className="text-xs text-white font-medium">View Details</span>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="mt-3 flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-white truncate">{component.name}</h3>
            <div className="flex flex-wrap gap-1 mt-1">
              <span className="text-[10px] text-slate-400 bg-white/5 px-2 py-0.5 rounded">{component.category}</span>
              {component.type && (
                <span className="text-[10px] text-accent-cyan bg-accent-cyan/10 px-2 py-0.5 rounded">{component.type}</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1 ml-2 flex-shrink-0">
            <button
              onClick={(e) => { 
                e.stopPropagation(); 
                onToggleFavorite(); 
              }}
              className="p-1 rounded hover:bg-white/5 transition"
            >
              <Star className={`w-3.5 h-3.5 ${isFavorite ? 'text-yellow-400 fill-yellow-400' : 'text-slate-500'}`} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); copyCode(); }}
              className="p-1 rounded hover:bg-white/5 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            </button>
          </div>
        </div>

        {component.description && (
          <p className="text-xs text-slate-400 mt-1.5 line-clamp-1">{component.description}</p>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setShowModal(false)}>
          <div className="bg-[#0F172A] border border-white/10 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-[#0F172A] border-b border-white/10 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-500/20 flex items-center justify-center">
                  <Layers className="w-5 h-5 text-brand-400" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">{component.name}</h2>
                  <div className="flex gap-2">
                    <span className="text-xs text-slate-400">{component.category}</span>
                    {component.type && (
                      <span className="text-xs text-accent-cyan bg-accent-cyan/10 px-2 py-0.5 rounded">{component.type}</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    onToggleFavorite(); 
                  }}
                  className="p-1.5 rounded hover:bg-white/5 transition"
                >
                  <Star className={`w-5 h-5 ${isFavorite ? 'text-yellow-400 fill-yellow-400' : 'text-slate-400'}`} />
                </button>
                <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Description */}
              {component.description && (
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Description</h4>
                  <p className="text-sm text-slate-300">{component.description}</p>
                </div>
              )}

              {/* Live Preview */}
              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Live Preview</h4>
                <div className={`${component.preview} p-6 rounded-xl flex items-center justify-center min-h-[120px] bg-[#0F172A]/50 border border-white/5`}>
                  <div className="text-center">
                    <p className="text-sm font-medium text-white">{component.name}</p>
                    {component.type && (
                      <p className="text-xs text-slate-400 mt-1">{component.type} Design System</p>
                    )}
                  </div>
                </div>
              </div>

              {/* CSS Variables */}
              {component.cssVariables && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">CSS Variables</h4>
                    <button 
                      onClick={copyCSSVariables}
                      className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" /> Copy All
                    </button>
                  </div>
                  <div className="bg-[#0F172A]/50 border border-white/5 rounded-lg p-4 font-mono text-xs">
                    <pre className="text-green-300 overflow-auto whitespace-pre-wrap">
{`:root {\n  ${Object.entries(component.cssVariables).map(([key, value]) => `${key}: ${value};`).join('\n  ')}\n}`}
                    </pre>
                  </div>
                </div>
              )}

              {/* Tailwind Classes */}
              {component.tailwindClasses && (
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Tailwind CSS Classes</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(component.tailwindClasses).map(([key, value]) => (
                      <div key={key} className="bg-[#0F172A]/30 border border-white/5 rounded-lg p-2">
                        <span className="text-[10px] text-slate-500">{key}</span>
                        <div className="text-xs text-white font-mono truncate">{value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Usage & Best For */}
              {component.usage && (
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Usage</h4>
                  <p className="text-sm text-slate-300">{component.usage}</p>
                  {component.bestFor && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {component.bestFor.map(item => (
                        <span key={item} className="text-xs bg-brand-500/10 text-brand-400 px-2 py-0.5 rounded border border-brand-500/20">
                          {item}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Code */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Code</h4>
                  <button 
                    onClick={copyCode}
                    className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" /> Copy
                  </button>
                </div>
                <div className="bg-[#0F172A]/50 border border-white/5 rounded-lg p-4">
                  <pre className="text-xs font-mono text-green-300 overflow-auto whitespace-pre-wrap">
                    {component.code || `<div className="${component.preview}">${component.name}</div>`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}