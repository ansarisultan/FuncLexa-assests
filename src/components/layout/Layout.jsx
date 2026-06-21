import { useState, useEffect, useRef } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import AIAssistant from '../modals/AIAssistant';
import { Sparkles } from 'lucide-react';
import { useWorkbench } from '../../context/WorkbenchContext';

export default function Layout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showAssistant, setShowAssistant] = useState(false);
  const containerRef = useRef(null);
  
  const { state: workbenchState } = useWorkbench();
  const isFullscreen = workbenchState.isFullscreen;

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      containerRef.current.style.setProperty('--mouse-x', x);
      containerRef.current.style.setProperty('--mouse-y', y);
    };

    const handleScroll = () => {
      if (!containerRef.current) return;
      const scroll = window.scrollY || document.documentElement.scrollTop;
      containerRef.current.style.setProperty('--scroll', `${scroll}px`);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="flex h-screen overflow-hidden bg-[#0A0A0F] relative"
      style={{ 
        '--mouse-x': 50, 
        '--mouse-y': 50,
        '--scroll': '0px',
      }}
    >
      {/* 3D Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Primary Glow - Follows Mouse */}
        <div 
          className="absolute w-[70vw] h-[70vw] rounded-full blur-3xl transition-all duration-1000 ease-out"
          style={{
            background: 'radial-gradient(circle, rgba(99,102,241,0.25) 0%, rgba(6,182,212,0.1) 40%, transparent 70%)',
            top: 'calc(var(--mouse-y) * 0.3 * 1%)',
            left: 'calc(var(--mouse-x) * 0.3 * 1%)',
            transform: 'translate(-50%, -50%)',
          }}
        />
        
        {/* Secondary Glow - Opposite Direction */}
        <div 
          className="absolute w-[50vw] h-[50vw] rounded-full blur-3xl transition-all duration-700 ease-out"
          style={{
            background: 'radial-gradient(circle, rgba(244,63,94,0.15) 0%, rgba(245,158,11,0.08) 40%, transparent 70%)',
            bottom: 'calc((100 - var(--mouse-y) * 0.2) * 1%)',
            right: 'calc((100 - var(--mouse-x) * 0.2) * 1%)',
            transform: 'translate(50%, 50%)',
          }}
        />
        
        {/* Third Glow - Middle */}
        <div 
          className="absolute w-[40vw] h-[40vw] rounded-full blur-3xl transition-all duration-500 ease-out"
          style={{
            background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, rgba(6,182,212,0.05) 40%, transparent 70%)',
            top: 'calc((50 + (var(--mouse-y) - 50) * 0.1) * 1%)',
            left: 'calc((50 + (var(--mouse-x) - 50) * 0.1) * 1%)',
            transform: 'translate(-50%, -50%)',
          }}
        />

        {/* Animated Orbs */}
        <div className="absolute top-[10%] left-[5%] w-32 h-32 rounded-full bg-primary-500/10 blur-2xl animate-float-slow" />
        <div className="absolute bottom-[15%] right-[8%] w-40 h-40 rounded-full bg-secondary-500/10 blur-2xl animate-float-medium" style={{ animationDelay: '-2s' }} />
        <div className="absolute top-[40%] right-[15%] w-24 h-24 rounded-full bg-accent-500/10 blur-2xl animate-float-fast" style={{ animationDelay: '-4s' }} />
        
        {/* Grid Lines */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="w-full h-full" style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }} />
        </div>
        
        {/* Floating Particles */}
        <div className="absolute top-[20%] left-[30%] w-1.5 h-1.5 rounded-full bg-primary-400/30 animate-float-slow" style={{ animationDelay: '-1s' }} />
        <div className="absolute bottom-[30%] right-[25%] w-2 h-2 rounded-full bg-secondary-400/30 animate-float-medium" style={{ animationDelay: '-3s' }} />
        <div className="absolute top-[60%] left-[60%] w-1 h-1 rounded-full bg-accent-400/30 animate-float-fast" style={{ animationDelay: '-2s' }} />
        <div className="absolute top-[10%] right-[40%] w-1.5 h-1.5 rounded-full bg-warm-400/30 animate-float-slow" style={{ animationDelay: '-4s' }} />
        <div className="absolute bottom-[20%] left-[20%] w-2 h-2 rounded-full bg-primary-400/20 animate-float-medium" style={{ animationDelay: '-5s' }} />
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      {!isFullscreen && (
        <div className={`
          fixed inset-y-0 left-0 z-50 w-64
          transform transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]
          lg:relative lg:translate-x-0
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <Sidebar onClose={() => setMobileOpen(false)} />
        </div>
      )}

      {/* Main workspace */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        {!isFullscreen && (
          <Topbar 
            onMenuClick={() => setMobileOpen(!mobileOpen)} 
            onAssistantClick={() => setShowAssistant(true)} 
          />
        )}
        <main className={`flex-1 overflow-y-auto relative ${isFullscreen ? 'p-0 h-screen w-screen' : 'p-6 lg:p-8'}`}>
          {/* Subtle overlay gradient */}
          {!isFullscreen && (
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-[#0A0A0F]/50" />
          )}
          <div className="relative z-10 h-full w-full">
            {children}
          </div>
        </main>
      </div>

      {/* Floating Constant AI Assistant Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setShowAssistant(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 hover:from-primary-600 hover:to-secondary-600 text-white font-medium shadow-[0_4px_20px_rgba(99,102,241,0.4)] hover:shadow-[0_4px_25px_rgba(99,102,241,0.5)] border border-white/10 hover:scale-110 active:scale-95 transition-all duration-300 group cursor-pointer"
          title="Ask FuncSilo AI"
        >
          <Sparkles className="w-4 h-4 text-white group-hover:animate-spin-slow" />
          <span className="text-xs tracking-wider font-semibold">Ask Lexa</span>
        </button>
      </div>

      {/* AI Assistant Modal */}
      <AIAssistant isOpen={showAssistant} onClose={() => setShowAssistant(false)} />
    </div>
  );
}