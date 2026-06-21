import { useState, useEffect, useRef } from 'react';
import { 
  Copy, Check, Undo, Redo, Download, 
  Palette, Layout, Type, Sparkles, 
  Maximize2, Minimize2, RefreshCw,
  Move, RotateCw, Eye, Droplet, Sun,
  Layers, Zap, Grid, Box, Circle, Square,
  Code, Wand2, Save, Share2, FileJson
} from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';

const defaultStyles = {
  // Background
  bgColor: '#0F172A',
  bgOpacity: 100,
  gradientType: 'none',
  gradientFrom: '#6366F1',
  gradientTo: '#06B6D4',
  gradientAngle: 135,
  gradientTexture: 'none',
  
  // Text
  textColor: '#FFFFFF',
  textSize: '20',
  textWeight: '600',
  textAlign: 'center',
  textOpacity: 100,
  
  // Layout
  paddingX: '24',
  paddingY: '24',
  width: '100',
  maxWidth: '400',
  margin: '0',
  gap: '16',
  
  // Effects
  borderRadius: '16',
  borderWidth: '1',
  borderColor: 'rgba(255,255,255,0.1)',
  shadowSize: '16',
  shadowOpacity: '30',
  blur: '0',
  glowSize: '0',
  glowColor: '#6366F1',
  
  // Animation
  animationType: 'none',
  animationDuration: '1000',
  animationDelay: '0',
  animationIteration: 'infinite',
  
  // Transform
  rotate: '0',
  scale: '100',
  translateX: '0',
  translateY: '0',
  perspective: '1000',
  rotateX: '0',
  rotateY: '0',
};

// Theme presets
const themes = {
  glassmorphism: {
    bgColor: 'rgba(255,255,255,0.05)',
    bgOpacity: 100,
    gradientType: 'none',
    gradientTexture: 'none',
    textColor: '#FFFFFF',
    textSize: '20',
    textWeight: '600',
    paddingX: '32',
    paddingY: '32',
    borderRadius: '24',
    borderWidth: '1',
    borderColor: 'rgba(255,255,255,0.1)',
    shadowSize: '20',
    shadowOpacity: '40',
    blur: '20',
    glowSize: '0',
    animationType: 'none',
  },
  neumorphism: {
    bgColor: '#0F172A',
    bgOpacity: 100,
    gradientType: 'none',
    gradientTexture: 'none',
    textColor: '#FFFFFF',
    textSize: '20',
    textWeight: '600',
    paddingX: '32',
    paddingY: '32',
    borderRadius: '24',
    borderWidth: '0',
    borderColor: 'rgba(255,255,255,0)',
    shadowSize: '16',
    shadowOpacity: '50',
    blur: '0',
    glowSize: '0',
    animationType: 'none',
  },
  cyberpunk: {
    bgColor: '#0F172A',
    bgOpacity: 100,
    gradientType: 'linear',
    gradientFrom: '#6366F1',
    gradientTo: '#06B6D4',
    gradientAngle: 135,
    gradientTexture: 'grid',
    textColor: '#FFFFFF',
    textSize: '24',
    textWeight: '800',
    paddingX: '32',
    paddingY: '32',
    borderRadius: '16',
    borderWidth: '2',
    borderColor: 'rgba(99,102,241,0.3)',
    shadowSize: '0',
    shadowOpacity: '0',
    blur: '0',
    glowSize: '30',
    glowColor: '#6366F1',
    animationType: 'glow',
    animationDuration: '2000',
    animationIteration: 'infinite',
  },
  minimalist: {
    bgColor: '#0A0A0F',
    bgOpacity: 100,
    gradientType: 'none',
    gradientTexture: 'none',
    textColor: '#FFFFFF',
    textSize: '18',
    textWeight: '400',
    paddingX: '24',
    paddingY: '24',
    borderRadius: '8',
    borderWidth: '1',
    borderColor: 'rgba(255,255,255,0.05)',
    shadowSize: '0',
    shadowOpacity: '0',
    blur: '0',
    glowSize: '0',
    animationType: 'none',
  },
  warm: {
    bgColor: '#1A1A2E',
    bgOpacity: 100,
    gradientType: 'linear',
    gradientFrom: '#F59E0B',
    gradientTo: '#FB7185',
    gradientAngle: 135,
    gradientTexture: 'none',
    textColor: '#FFFFFF',
    textSize: '22',
    textWeight: '700',
    paddingX: '32',
    paddingY: '32',
    borderRadius: '20',
    borderWidth: '1',
    borderColor: 'rgba(245,158,11,0.2)',
    shadowSize: '16',
    shadowOpacity: '30',
    blur: '0',
    glowSize: '20',
    glowColor: '#F59E0B',
    animationType: 'float',
    animationDuration: '3000',
    animationIteration: 'infinite',
  },
  dark: {
    bgColor: '#050816',
    bgOpacity: 100,
    gradientType: 'none',
    gradientTexture: 'none',
    textColor: '#FFFFFF',
    textSize: '20',
    textWeight: '600',
    paddingX: '28',
    paddingY: '28',
    borderRadius: '16',
    borderWidth: '1',
    borderColor: 'rgba(255,255,255,0.06)',
    shadowSize: '12',
    shadowOpacity: '40',
    blur: '0',
    glowSize: '0',
    animationType: 'none',
  }
};

import { useWorkbench } from '../context/WorkbenchContext';

export default function DesignStudio() {
  const [styles, setStyles] = useState(defaultStyles);
  const [copied, setCopied] = useState(false);
  const [copiedTailwind, setCopiedTailwind] = useState(false);
  const [activeTab, setActiveTab] = useState('properties');
  
  const { state: workbenchState, dispatch: workbenchDispatch } = useWorkbench();
  const isFullscreen = workbenchState.isFullscreen;
  const setIsFullscreen = (val) => workbenchDispatch({ type: 'SET_FULLSCREEN', payload: val });

  const [componentName, setComponentName] = useState('MyComponent');
  const [isHovered, setIsHovered] = useState(false);
  const [showThemes, setShowThemes] = useState(false);
  const canvasRef = useRef(null);
  const { addNotification } = useNotifications();

  // History
  const [history, setHistory] = useState([defaultStyles]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const isUndoRedoRef = useRef(false);

  useEffect(() => {
    // Write styles to localStorage for AI Assistant context-awareness
    localStorage.setItem('funclexa_studio_styles', JSON.stringify(styles));

    if (isUndoRedoRef.current) {
      isUndoRedoRef.current = false;
      return;
    }

    if (history.length > 0 && history[historyIndex] === styles) {
      return;
    }

    const newHistory = history.slice(0, historyIndex + 1);
    setHistory([...newHistory, styles]);
    setHistoryIndex(newHistory.length);
  }, [styles, history, historyIndex]);

  // Keyboard shortcuts for Undo / Redo
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Check for Ctrl+Z or Cmd+Z
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault();
        if (historyIndex > 0) {
          handleUndo();
        }
      }
      // Check for Ctrl+Y or Cmd+Y
      if ((e.metaKey || e.ctrlKey) && e.key === 'y') {
        e.preventDefault();
        if (historyIndex < history.length - 1) {
          handleRedo();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [historyIndex, history]);

  const handleChange = (key, value) => {
    setStyles(prev => ({ ...prev, [key]: value }));
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      isUndoRedoRef.current = true;
      const prevIndex = historyIndex - 1;
      setHistoryIndex(prevIndex);
      setStyles(history[prevIndex]);
      addNotification({
        title: 'Undo',
        description: 'Reverted to previous state',
        type: 'info',
        icon: 'undo'
      });
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      isUndoRedoRef.current = true;
      const nextIndex = historyIndex + 1;
      setHistoryIndex(nextIndex);
      setStyles(history[nextIndex]);
      addNotification({
        title: 'Redo',
        description: 'Restored to next state',
        type: 'info',
        icon: 'redo'
      });
    }
  };

  const resetStyles = () => {
    setStyles(defaultStyles);
    addNotification({
      title: 'Reset',
      description: 'Styles have been reset to default',
      type: 'info',
      icon: 'refresh'
    });
  };

  const applyTheme = (themeName) => {
    const theme = themes[themeName];
    if (theme) {
      setStyles(prev => ({ ...prev, ...theme }));
      setShowThemes(false);
      addNotification({
        title: 'Theme Applied',
        description: `${themeName.charAt(0).toUpperCase() + themeName.slice(1)} theme has been applied`,
        type: 'success',
        icon: 'sparkles'
      });
    }
  };

  const generateTheme = () => {
    // Generate a random theme from current styles
    const colors = ['#6366F1', '#06B6D4', '#F43F5E', '#F59E0B', '#8B5CF6', '#10B981', '#EC4899'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const randomColor2 = colors[Math.floor(Math.random() * colors.length)];
    
    const newTheme = {
      ...styles,
      gradientFrom: randomColor,
      gradientTo: randomColor2,
      gradientType: Math.random() > 0.5 ? 'linear' : 'radial',
      gradientAngle: Math.floor(Math.random() * 360),
      glowColor: randomColor,
      glowSize: Math.random() > 0.6 ? Math.floor(Math.random() * 40) + 10 : 0,
      animationType: ['none', 'pulse', 'float', 'glow'][Math.floor(Math.random() * 4)],
    };
    
    setStyles(newTheme);
    addNotification({
      title: 'Theme Generated 🎨',
      description: 'New random theme has been applied',
      type: 'success',
      icon: 'sparkles'
    });
  };

  const downloadComponent = () => {
    const code = generateComponentCode();
    const blob = new Blob([code], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${componentName}.jsx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    addNotification({
      title: 'Component Downloaded',
      description: `${componentName}.jsx has been saved`,
      type: 'success',
      icon: 'download'
    });
  };

  // Generate CSS
  const generateCSS = () => {
    const styleObj = {
      backgroundColor: styles.gradientType !== 'none' ? 'transparent' : styles.bgColor,
      background: styles.gradientType !== 'none' 
        ? `${styles.gradientType}-gradient(${styles.gradientAngle}deg, ${styles.gradientFrom}, ${styles.gradientTo})`
        : undefined,
      color: styles.textColor,
      padding: `${styles.paddingY}px ${styles.paddingX}px`,
      width: `${styles.width}%`,
      maxWidth: `${styles.maxWidth}px`,
      margin: `${styles.margin}px auto`,
      borderRadius: `${styles.borderRadius}px`,
      border: `${styles.borderWidth}px solid ${styles.borderColor}`,
      boxShadow: `0 ${styles.shadowSize}px ${styles.shadowSize * 2}px rgba(0,0,0,${styles.shadowOpacity/100})`,
      fontSize: `${styles.textSize}px`,
      fontWeight: styles.textWeight,
      textAlign: styles.textAlign,
      opacity: styles.textOpacity / 100,
      backdropFilter: styles.blur !== '0' ? `blur(${styles.blur}px)` : 'none',
      transform: `perspective(${styles.perspective}px) rotateX(${styles.rotateX}deg) rotateY(${styles.rotateY}deg) rotate(${styles.rotate}deg) scale(${styles.scale/100}) translate(${styles.translateX}px, ${styles.translateY}px)`,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      gap: `${styles.gap}px`,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    };

    // Glow effect
    if (styles.glowSize !== '0') {
      styleObj.boxShadow = `0 0 ${styles.glowSize}px ${styles.glowColor}`;
    }

    // Animation
    if (styles.animationType !== 'none') {
      const animations = {
        pulse: `pulse ${styles.animationDuration}ms ease-in-out ${styles.animationIteration}`,
        bounce: `bounce ${styles.animationDuration}ms ease ${styles.animationIteration}`,
        float: `float ${styles.animationDuration}ms ease-in-out ${styles.animationIteration}`,
        glow: `glow ${styles.animationDuration}ms ease-in-out ${styles.animationIteration}`,
        shimmer: `shimmer ${styles.animationDuration}ms ease-in-out ${styles.animationIteration}`,
        wiggle: `wiggle ${styles.animationDuration}ms ease-in-out ${styles.animationIteration}`,
        spin: `spin ${styles.animationDuration}ms linear ${styles.animationIteration}`,
        '3d-rotate': `rotate3d ${styles.animationDuration}ms ease-in-out ${styles.animationIteration}`,
      };
      styleObj.animation = animations[styles.animationType] || animations.pulse;
    }

    // Texture overlay
    if (styles.gradientTexture !== 'none') {
      const textures = {
        dots: `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
        grid: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
        noise: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E")`,
        lines: `repeating-linear-gradient(45deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 2px, transparent 2px, transparent 8px)`,
      };
      styleObj.backgroundImage = textures[styles.gradientTexture];
      if (styles.gradientType !== 'none') {
        styleObj.backgroundImage = `${styleObj.background}, ${textures[styles.gradientTexture]}`;
      }
    }

    return Object.entries(styleObj)
      .filter(([_, value]) => value !== undefined && value !== 'none' && value !== '0px' && value !== '0deg' && value !== '100%' && value !== '')
      .map(([key, value]) => {
        const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
        if (typeof value === 'string' && value.includes('rgba')) {
          return `${cssKey}: ${value};`;
        }
        return `${cssKey}: ${value};`;
      })
      .join('\n  ');
  };

  // Generate Component Code
  const generateComponentCode = () => {
    const css = generateCSS();
    const styleText = css ? `\n  ${css}\n` : '';
    return `// ${componentName}.jsx
import React from 'react';

const ${componentName} = ({ className, children, ...props }) => {
  const styles = {${styleText}  };

  return (
    <div style={styles} className={className} {...props}>
      {children || (
        <>
          <h3 style={{ margin: 0, color: '${styles.textColor || '#FFFFFF'}', fontSize: '${styles.textSize || '20'}px' }}>
            ${componentName}
          </h3>
          <p style={{ opacity: 0.7, margin: '8px 0 0 0', color: '${styles.textColor || '#FFFFFF'}' }}>
            Built with Design Studio
          </p>
        </>
      )}
    </div>
  );
};

export default ${componentName};`;
  };

  // Generate Tailwind Classes
  const generateTailwindClasses = () => {
    const classes = [];
    
    if (styles.gradientType !== 'none') {
      classes.push('bg-gradient-to-br ' + 'from-[' + styles.gradientFrom + '] ' + 'to-[' + styles.gradientTo + ']');
    } else {
      classes.push('bg-[' + styles.bgColor + ']');
    }
    
    classes.push('text-[' + styles.textColor + ']');
    classes.push('px-[' + styles.paddingX + 'px] ' + 'py-[' + styles.paddingY + 'px]');
    classes.push('w-[' + styles.width + '%] ' + 'max-w-[' + styles.maxWidth + 'px]');
    classes.push('mx-auto ' + 'rounded-[' + styles.borderRadius + 'px]');
    classes.push('border-[' + styles.borderWidth + 'px] ' + 'border-[' + styles.borderColor + ']');
    classes.push('shadow-[0_' + styles.shadowSize + 'px_' + (styles.shadowSize*2) + 'px_rgba(0,0,0,' + (styles.shadowOpacity/100) + ')]');
    classes.push('text-[' + styles.textSize + 'px] ' + 'font-[' + styles.textWeight + '] ' + 'text-' + styles.textAlign);
    classes.push('opacity-[' + (styles.textOpacity/100) + ']');
    
    if (styles.blur !== '0') {
      classes.push('backdrop-blur-[' + styles.blur + 'px]');
    }
    
    if (styles.glowSize !== '0') {
      classes.push('shadow-[0_0_' + styles.glowSize + 'px_' + styles.glowColor + ']');
    }
    
    if (styles.animationType !== 'none') {
      const animClasses = {
        pulse: 'animate-pulse',
        bounce: 'animate-bounce',
        float: 'animate-float',
        glow: 'animate-glow-pulse',
        shimmer: 'animate-shimmer',
        wiggle: 'animate-wiggle',
        spin: 'animate-spin',
        '3d-rotate': 'animate-3d-rotate',
      };
      classes.push(animClasses[styles.animationType]);
    }
    
    if (styles.gradientTexture !== 'none') {
      const textureClasses = {
        dots: 'bg-[radial-gradient(circle_at_20%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)]',
        grid: 'bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)]',
        lines: 'bg-[repeating-linear-gradient(45deg,rgba(255,255,255,0.03)_0px,rgba(255,255,255,0.03)_2px,transparent_2px,transparent_8px)]',
      };
      classes.push(textureClasses[styles.gradientTexture]);
    }
    
    // 3D transforms
    if (styles.perspective !== '1000') {
      classes.push('perspective-[' + styles.perspective + 'px]');
    }
    if (styles.rotateX !== '0') {
      classes.push('rotateX-[' + styles.rotateX + 'deg]');
    }
    if (styles.rotateY !== '0') {
      classes.push('rotateY-[' + styles.rotateY + 'deg]');
    }
    
    return classes.filter(c => c && !c.includes('undefined')).join(' ');
  };

  const code = generateComponentCode();
  const tailwindClasses = generateTailwindClasses();

  const copyCode = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      addNotification({
        title: 'Copied!',
        description: 'Component code copied to clipboard',
        type: 'success',
        icon: 'copy'
      });
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const copyTailwind = () => {
    navigator.clipboard.writeText(tailwindClasses).then(() => {
      setCopiedTailwind(true);
      addNotification({
        title: 'Copied!',
        description: 'Tailwind classes copied to clipboard',
        type: 'success',
        icon: 'copy'
      });
      setTimeout(() => setCopiedTailwind(false), 2000);
    });
  };

  // Slider component
  const SliderControl = ({ label, value, min, max, step, onChange, suffix = '', icon: Icon }) => (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {Icon && <Icon className="w-3 h-3 text-slate-500" />}
          <span className="text-[10px] text-slate-400">{label}</span>
        </div>
        <span className="text-[10px] font-mono text-white">{value}{suffix}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1 bg-slate-800 rounded-full appearance-none cursor-pointer
          accent-primary-500
          [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5
          [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r 
          [&::-webkit-slider-thumb]:from-primary-500 [&::-webkit-slider-thumb]:to-secondary-400
          [&::-webkit-slider-thumb]:shadow-[0_0_20px_rgba(99,102,241,0.3)]
          [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:hover:scale-110"
      />
    </div>
  );

  // Color control
  const ColorControl = ({ label, value, onChange }) => (
    <div className="flex items-center gap-2">
      <span className="text-[10px] text-slate-400 w-16 flex-shrink-0">{label}</span>
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-8 h-8 rounded-xl border border-white/10 bg-transparent cursor-pointer hover:scale-110 transition-transform"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 bg-[#0F172A]/50 border border-white/5 rounded-lg px-2 py-1 text-[10px] font-mono text-white focus:ring-1 focus:ring-primary-500 outline-none"
      />
    </div>
  );

  // Select control
  const SelectControl = ({ label, value, options, onChange, icon: Icon }) => (
    <div className="flex items-center gap-2">
      {Icon && <Icon className="w-3 h-3 text-slate-500" />}
      <span className="text-[10px] text-slate-400 flex-1">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-[#0F172A]/50 border border-white/5 rounded-lg px-2 py-1 text-[10px] text-white focus:ring-1 focus:ring-primary-500 outline-none"
      >
        {options.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );

  const ControlGroup = ({ label, icon: Icon, children }) => (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-[10px] font-medium text-slate-400 uppercase tracking-wider">
        <Icon className="w-3.5 h-3.5" />
        {label}
      </div>
      <div className="space-y-2">
        {children}
      </div>
    </div>
  );

  return (
    <div className={`w-full ${isFullscreen ? 'fixed inset-0 z-[60] bg-[#0A0A0F] p-4 overflow-y-auto lg:overflow-hidden lg:h-screen' : 'h-auto lg:h-[calc(100vh-6rem)]'}`}>
      <div className="flex flex-col lg:h-full gap-4">
        {/* Header */}
        <div className="glass-gradient p-4 relative flex items-center justify-between flex-wrap gap-3 z-40 !overflow-visible">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl animate-float-slow pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-secondary-500/10 rounded-full blur-3xl animate-float-medium pointer-events-none" />
          
          <div className="relative flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.2)] animate-float-slow">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gradient-cyber">FuncSilo Design Studio</h1>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={componentName}
                  onChange={(e) => setComponentName(e.target.value)}
                  className="bg-[#0F172A]/50 border border-white/10 rounded-lg px-3 py-0.5 text-xs text-white focus:ring-1 focus:ring-primary-500 outline-none w-32"
                  placeholder="Component name"
                />
              </div>
            </div>
          </div>
          
          <div className="relative flex items-center gap-1">
            {/* Undo/Redo */}
            <button
              id="btn-undo"
              onClick={() => {
                console.log("Undo button clicked! historyIndex:", historyIndex);
                handleUndo();
              }}
              disabled={historyIndex === 0}
              className="p-2 rounded-xl hover:bg-white/5 disabled:opacity-30 transition-all duration-300 hover:scale-110"
              title="Undo (Ctrl+Z)"
            >
              <Undo className="w-4 h-4 text-slate-400" />
            </button>
            <button
              id="btn-redo"
              onClick={() => {
                console.log("Redo button clicked! historyIndex:", historyIndex);
                handleRedo();
              }}
              disabled={historyIndex === history.length - 1}
              className="p-2 rounded-xl hover:bg-white/5 disabled:opacity-30 transition-all duration-300 hover:scale-110"
              title="Redo (Ctrl+Y)"
            >
              <Redo className="w-4 h-4 text-slate-400" />
            </button>
            
            {/* Reset */}
            <button
              id="btn-reset"
              onClick={() => {
                console.log("Reset button clicked!");
                resetStyles();
              }}
              className="p-2 rounded-xl hover:bg-white/5 transition-all duration-300 hover:scale-110"
              title="Reset Styles"
            >
              <RefreshCw className="w-4 h-4 text-slate-400" />
            </button>

            {/* Themes Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  console.log("Themes button clicked! Current showThemes:", showThemes);
                  setShowThemes(!showThemes);
                }}
                className="p-2 rounded-xl hover:bg-white/5 transition-all duration-300 hover:scale-110 bg-gradient-to-r from-primary-500/20 to-secondary-500/20"
                title="Apply Theme"
              >
                <Palette className="w-4 h-4 text-gradient-cyber" />
              </button>
              {showThemes && (
                <div className="absolute right-0 mt-2 w-48 bg-[#0F172A] border border-white/10 rounded-xl shadow-3d backdrop-blur-xl overflow-hidden z-50 animate-slide-up">
                  <div className="p-2">
                    <div className="px-3 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                      Themes
                    </div>
                    {Object.keys(themes).map((theme) => (
                      <button
                        key={theme}
                        onClick={() => applyTheme(theme)}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/5 transition text-sm text-white capitalize"
                      >
                        {theme}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Generate Theme */}
            <button
              onClick={() => {
                console.log("Generate Theme clicked!");
                generateTheme();
              }}
              className="p-2 rounded-xl hover:bg-white/5 transition-all duration-300 hover:scale-110"
              title="Generate Random Theme"
            >
              <Wand2 className="w-4 h-4 text-warm-400" />
            </button>

            {/* Fullscreen */}
            <button
              onClick={() => {
                console.log("Fullscreen button clicked! Current isFullscreen:", isFullscreen);
                setIsFullscreen(!isFullscreen);
              }}
              className="p-2 rounded-xl hover:bg-white/5 transition-all duration-300 hover:scale-110"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4 text-slate-400" /> : <Maximize2 className="w-4 h-4 text-slate-400" />}
            </button>

            {/* Download */}
            <button
              onClick={downloadComponent}
              className="p-2 rounded-xl hover:bg-white/5 transition-all duration-300 hover:scale-110 bg-primary-500/10"
              title="Download Component"
            >
              <Download className="w-4 h-4 text-primary-400" />
            </button>
          </div>
        </div>

        {/* Main Layout */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:min-h-0">
          {/* Left Panel - Controls */}
          <div className="lg:col-span-3 panel-3d overflow-hidden flex flex-col min-h-[550px] lg:min-h-0 lg:h-full">
            <div className="flex border-b border-white/5">
              {['properties', 'effects', '3d'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 px-3 py-2 text-[10px] font-medium transition-all duration-300 ${
                    activeTab === tab 
                      ? 'bg-gradient-to-r from-primary-500/20 to-secondary-500/20 text-primary-400 border-b-2 border-primary-400' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {tab === 'properties' ? '🎨 Style' : tab === 'effects' ? '✨ FX & Anim' : '🌀 3D'}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {activeTab === 'properties' && (
                <>
                  {/* Background */}
                  <ControlGroup label="Background" icon={Palette}>
                    <ColorControl 
                      label="Color" 
                      value={styles.bgColor} 
                      onChange={(v) => handleChange('bgColor', v)} 
                    />
                    <SliderControl
                      label="Opacity"
                      value={styles.bgOpacity}
                      min={0}
                      max={100}
                      step={1}
                      suffix="%"
                      onChange={(v) => handleChange('bgOpacity', v)}
                    />
                    <SelectControl
                      label="Gradient"
                      value={styles.gradientType}
                      options={['none', 'linear', 'radial', 'conic']}
                      onChange={(v) => handleChange('gradientType', v)}
                      icon={Sun}
                    />
                    {styles.gradientType !== 'none' && (
                      <>
                        <ColorControl 
                          label="From" 
                          value={styles.gradientFrom} 
                          onChange={(v) => handleChange('gradientFrom', v)} 
                        />
                        <ColorControl 
                          label="To" 
                          value={styles.gradientTo} 
                          onChange={(v) => handleChange('gradientTo', v)} 
                        />
                        <SliderControl
                          label="Angle"
                          value={styles.gradientAngle}
                          min={0}
                          max={360}
                          step={1}
                          suffix="°"
                          onChange={(v) => handleChange('gradientAngle', v)}
                        />
                      </>
                    )}
                    <SelectControl
                      label="Texture"
                      value={styles.gradientTexture}
                      options={['none', 'dots', 'grid', 'noise', 'lines']}
                      onChange={(v) => handleChange('gradientTexture', v)}
                      icon={Droplet}
                    />
                  </ControlGroup>

                  {/* Typography */}
                  <ControlGroup label="Typography" icon={Type}>
                    <ColorControl 
                      label="Color" 
                      value={styles.textColor} 
                      onChange={(v) => handleChange('textColor', v)} 
                    />
                    <SliderControl
                      label="Size"
                      value={parseInt(styles.textSize)}
                      min={10}
                      max={60}
                      step={1}
                      suffix="px"
                      onChange={(v) => handleChange('textSize', `${v}`)}
                    />
                    {/* <SelectControl
                      label="Weight"
                      value={styles.textWeight}
                      options={['300', '400', '500', '600', '700', '800']}
                      onChange={(v) => handleChange('textWeight', v)}
                    /> */}
                    <SelectControl
                      label="Align"
                      value={styles.textAlign}
                      options={['left', 'center', 'right']}
                      onChange={(v) => handleChange('textAlign', v)}
                    />
                    {/* <SliderControl
                      label="Opacity"
                      value={styles.textOpacity}
                      min={0}
                      max={100}
                      step={1}
                      suffix="%"
                      onChange={(v) => handleChange('textOpacity', v)}
                    /> */}
                  </ControlGroup>

                  {/* Layout */}
                  <ControlGroup label="Layout" icon={Layout}>
                    <SliderControl
                      label="Padding X"
                      value={styles.paddingX}
                      min={0}
                      max={80}
                      step={2}
                      suffix="px"
                      onChange={(v) => handleChange('paddingX', v)}
                    />
                    <SliderControl
                      label="Padding Y"
                      value={styles.paddingY}
                      min={0}
                      max={80}
                      step={2}
                      suffix="px"
                      onChange={(v) => handleChange('paddingY', v)}
                    />
                    {/* <SliderControl
                      label="Width"
                      value={styles.width}
                      min={20}
                      max={100}
                      step={5}
                      suffix="%"
                      onChange={(v) => handleChange('width', v)}
                    />
                    <SliderControl
                      label="Max Width"
                      value={styles.maxWidth}
                      min={200}
                      max={800}
                      step={20}
                      suffix="px"
                      onChange={(v) => handleChange('maxWidth', v)}
                    />
                    <SliderControl
                      label="Gap"
                      value={styles.gap}
                      min={0}
                      max={48}
                      step={2}
                      suffix="px"
                      onChange={(v) => handleChange('gap', v)}
                    /> */}
                    <SliderControl
                      label="Radius"
                      value={styles.borderRadius}
                      min={0}
                      max={48}
                      step={2}
                      suffix="px"
                      onChange={(v) => handleChange('borderRadius', v)}
                    />
                  </ControlGroup>

                </>
              )}

              {activeTab === 'effects' && (
                <>
                  {/* Effects */}
                  <ControlGroup label="Effects" icon={Eye}>
                    <SliderControl
                      label="Border Width"
                      value={styles.borderWidth}
                      min={0}
                      max={8}
                      step={1}
                      suffix="px"
                      onChange={(v) => handleChange('borderWidth', v)}
                    />
                    <ColorControl 
                      label="Border Color" 
                      value={styles.borderColor} 
                      onChange={(v) => handleChange('borderColor', v)} 
                    />
                    <SliderControl
                      label="Shadow Size"
                      value={styles.shadowSize}
                      min={0}
                      max={40}
                      step={2}
                      suffix="px"
                      onChange={(v) => handleChange('shadowSize', v)}
                    />
                    {/* <SliderControl
                      label="Shadow Opacity"
                      value={styles.shadowOpacity}
                      min={0}
                      max={100}
                      step={5}
                      suffix="%"
                      onChange={(v) => handleChange('shadowOpacity', v)}
                    /> */}
                    <SliderControl
                      label="Blur"
                      value={styles.blur}
                      min={0}
                      max={40}
                      step={2}
                      suffix="px"
                      onChange={(v) => handleChange('blur', v)}
                    />
                    <SliderControl
                      label="Glow Size"
                      value={styles.glowSize}
                      min={0}
                      max={60}
                      step={2}
                      suffix="px"
                      onChange={(v) => handleChange('glowSize', v)}
                    />
                    {styles.glowSize !== '0' && (
                      <ColorControl 
                        label="Glow Color" 
                        value={styles.glowColor} 
                        onChange={(v) => handleChange('glowColor', v)} 
                      />
                    )}
                  </ControlGroup>

                  {/* Animation */}
                  <ControlGroup label="Animation" icon={Sparkles}>
                    <SelectControl
                      label="Type"
                      value={styles.animationType}
                      options={['none', 'pulse', 'bounce', 'float', 'glow', 'shimmer', 'wiggle', 'spin', '3d-rotate']}
                      onChange={(v) => handleChange('animationType', v)}
                    />
                    {styles.animationType !== 'none' && (
                      <>
                        <SliderControl
                          label="Duration"
                          value={styles.animationDuration}
                          min={200}
                          max={3000}
                          step={100}
                          suffix="ms"
                          onChange={(v) => handleChange('animationDuration', v)}
                        />
                        {/* <SelectControl
                          label="Iteration"
                          value={styles.animationIteration}
                          options={['infinite', '1', '2', '3', '4', '5']}
                          onChange={(v) => handleChange('animationIteration', v)}
                        /> */}
                      </>
                    )}
                  </ControlGroup>
                </>
              )}

              {activeTab === '3d' && (
                <ControlGroup label="3D Transform" icon={Box}>
                  <SliderControl
                    label="Perspective"
                    value={styles.perspective}
                    min={200}
                    max={2000}
                    step={50}
                    suffix="px"
                    onChange={(v) => handleChange('perspective', v)}
                  />
                  <SliderControl
                    label="Rotate X"
                    value={styles.rotateX}
                    min={-45}
                    max={45}
                    step={1}
                    suffix="°"
                    onChange={(v) => handleChange('rotateX', v)}
                  />
                  <SliderControl
                    label="Rotate Y"
                    value={styles.rotateY}
                    min={-45}
                    max={45}
                    step={1}
                    suffix="°"
                    onChange={(v) => handleChange('rotateY', v)}
                  />
                  <SliderControl
                    label="Rotate Z"
                    value={styles.rotate}
                    min={-180}
                    max={180}
                    step={5}
                    suffix="°"
                    onChange={(v) => handleChange('rotate', v)}
                  />
                  <SliderControl
                    label="Scale"
                    value={styles.scale}
                    min={50}
                    max={200}
                    step={5}
                    suffix="%"
                    onChange={(v) => handleChange('scale', v)}
                  />
                  {/* <SliderControl
                    label="Translate X"
                    value={styles.translateX}
                    min={-100}
                    max={100}
                    step={5}
                    suffix="px"
                    onChange={(v) => handleChange('translateX', v)}
                  />
                  <SliderControl
                    label="Translate Y"
                    value={styles.translateY}
                    min={-100}
                    max={100}
                    step={5}
                    suffix="px"
                    onChange={(v) => handleChange('translateY', v)}
                  /> */}
                </ControlGroup>
              )}
            </div>
          </div>

          {/* Center Panel - Canvas */}
          <div className="lg:col-span-6 panel-3d p-6 flex items-center justify-center relative overflow-hidden bg-[#0A0A0F]/50 min-h-[350px] lg:min-h-0 lg:h-full">
            <div 
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                `,
                backgroundSize: '30px 30px',
              }}
            />
            
            <div 
              ref={canvasRef}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              style={{
                backgroundColor: styles.gradientType !== 'none' ? 'transparent' : styles.bgColor,
                background: styles.gradientType !== 'none' 
                  ? `${styles.gradientType}-gradient(${styles.gradientAngle}deg, ${styles.gradientFrom}, ${styles.gradientTo})`
                  : styles.gradientTexture !== 'none' 
                    ? styles.bgColor
                    : undefined,
                color: styles.textColor,
                padding: `${styles.paddingY}px ${styles.paddingX}px`,
                width: `${styles.width}%`,
                maxWidth: `${styles.maxWidth}px`,
                margin: `${styles.margin}px auto`,
                borderRadius: `${styles.borderRadius}px`,
                border: `${styles.borderWidth}px solid ${styles.borderColor}`,
                boxShadow: styles.glowSize !== '0' 
                  ? `0 0 ${styles.glowSize}px ${styles.glowColor}`
                  : `0 ${styles.shadowSize}px ${styles.shadowSize * 2}px rgba(0,0,0,${styles.shadowOpacity/100})`,
                fontSize: `${styles.textSize}px`,
                fontWeight: styles.textWeight,
                textAlign: styles.textAlign,
                opacity: styles.textOpacity / 100,
                backdropFilter: styles.blur !== '0' ? `blur(${styles.blur}px)` : 'none',
                transform: `perspective(${styles.perspective}px) rotateX(${styles.rotateX}deg) rotateY(${styles.rotateY}deg) rotate(${styles.rotate}deg) scale(${styles.scale/100}) translate(${styles.translateX}px, ${styles.translateY}px)`,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                gap: `${styles.gap}px`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                ...(styles.animationType !== 'none' && {
                  animation: `${styles.animationType} ${styles.animationDuration}ms ease-in-out ${styles.animationIteration}`,
                }),
                ...(styles.gradientTexture !== 'none' && styles.gradientType === 'none' && {
                  backgroundImage: styles.gradientTexture === 'dots' 
                    ? `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 1px, transparent 1px)`
                    : styles.gradientTexture === 'grid'
                      ? `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`
                      : styles.gradientTexture === 'lines'
                        ? `repeating-linear-gradient(45deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 2px, transparent 2px, transparent 8px)`
                        : undefined,
                  backgroundSize: styles.gradientTexture === 'dots' ? '20px 20px' : 
                                   styles.gradientTexture === 'grid' ? '20px 20px' :
                                   styles.gradientTexture === 'lines' ? '16px 16px' : undefined,
                }),
              }}
              className="flex flex-col items-center justify-center p-6 relative"
            >
              {/* Content */}
              <h3 style={{ margin: 0, color: styles.textColor, fontSize: `${styles.textSize}px` }}>
                {componentName}
              </h3>
              <p style={{ opacity: 0.7, margin: '8px 0 0 0', color: styles.textColor, fontSize: '14px' }}>
                Built with Design Studio
              </p>
              
              {/* Hover indicator */}
              {isHovered && (
                <div className="absolute top-3 right-3 text-[8px] text-slate-500 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full border border-white/5 animate-float-slow">
                  ✦ 3D Interactive
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Code */}
          <div className="lg:col-span-3 panel-3d overflow-hidden flex flex-col min-h-[550px] lg:min-h-0 lg:h-full">
            {/* React Component Section */}
            <div className="flex-1 flex flex-col min-h-0 border-b border-white/5">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/5 bg-white/[0.02]">
                <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-2 uppercase tracking-wider">
                  <Code className="w-3.5 h-3.5 text-primary-400" />
                  React Component
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={copyCode}
                    className="text-[10px] text-primary-400 hover:text-primary-300 flex items-center gap-1 transition"
                  >
                    {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                  <button
                    onClick={downloadComponent}
                    className="text-[10px] text-secondary-400 hover:text-secondary-300 flex items-center gap-1 transition"
                    title="Download React Component Code"
                  >
                    <Download className="w-3 h-3" />
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-auto p-3 bg-[#08080C]">
                <pre className="text-[10px] font-mono text-green-300 whitespace-pre-wrap leading-relaxed">
                  {code}
                </pre>
              </div>
            </div>

            {/* Tailwind Component Section */}
            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/5 bg-white/[0.02]">
                <span className="text-[10px] font-semibold text-slate-400 flex items-center gap-2 uppercase tracking-wider">
                  <Zap className="w-3.5 h-3.5 text-secondary-400" />
                  Tailwind Component
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={copyTailwind}
                    className="text-[10px] text-secondary-400 hover:text-secondary-300 flex items-center gap-1 transition"
                  >
                    {copiedTailwind ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copiedTailwind ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-auto p-3 bg-[#08080C]">
                <pre className="text-[10px] font-mono text-cyan-300 whitespace-pre-wrap leading-relaxed">
                  {`<div className="${tailwindClasses}">
  <h3>${componentName}</h3>
  <p>Built with FuncSilo Design Studio</p>
</div>`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.8; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(2deg); }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.3); }
          50% { box-shadow: 0 0 60px rgba(99, 102, 241, 0.6); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes wiggle {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes rotate3d {
          0%, 100% { transform: perspective(1000px) rotateX(-5deg) rotateY(5deg); }
          50% { transform: perspective(1000px) rotateX(5deg) rotateY(-5deg); }
        }
      `}} />
    </div>
  );
}