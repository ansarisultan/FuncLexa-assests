import { useState, useEffect, useRef } from 'react';
import { 
  Copy, Check, Undo, Redo, Download, 
  Palette, Layout, Type, Sparkles, 
  Maximize2, Minimize2, RefreshCw,
  Move, RotateCw, Eye, Droplet, Sun
} from 'lucide-react';

const defaultStyles = {
  // Background
  bgColor: '#0F172A',
  bgOpacity: 100,
  gradientType: 'none',
  gradientFrom: '#5E6AD2',
  gradientTo: '#06B6D4',
  gradientAngle: 135,
  gradientTexture: 'none',
  
  // Text
  textColor: '#FFFFFF',
  textSize: '20px',
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
  glowColor: '#5E6AD2',
  
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
};

export default function DesignStudio() {
  const [styles, setStyles] = useState(defaultStyles);
  const [copied, setCopied] = useState(false);
  const [copiedTailwind, setCopiedTailwind] = useState(false);
  const [activeTab, setActiveTab] = useState('properties');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [componentName, setComponentName] = useState('MyComponent');
  const [isHovered, setIsHovered] = useState(false);
  const canvasRef = useRef(null);

  // History
  const [history, setHistory] = useState([defaultStyles]);
  const [historyIndex, setHistoryIndex] = useState(0);

  useEffect(() => {
    if (historyIndex < history.length - 1) {
      setHistory(prev => prev.slice(0, historyIndex + 1));
    }
    setHistory(prev => [...prev, styles]);
    setHistoryIndex(prev => prev + 1);
  }, [styles]);

  const handleChange = (key, value) => {
    setStyles(prev => ({ ...prev, [key]: value }));
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1);
      setStyles(history[historyIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1);
      setStyles(history[historyIndex + 1]);
    }
  };

  const resetStyles = () => {
    setStyles(defaultStyles);
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
      fontSize: styles.textSize,
      fontWeight: styles.textWeight,
      textAlign: styles.textAlign,
      opacity: styles.textOpacity / 100,
      backdropFilter: styles.blur !== '0' ? `blur(${styles.blur}px)` : 'none',
      transform: `rotate(${styles.rotate}deg) scale(${styles.scale/100}) translate(${styles.translateX}px, ${styles.translateY}px)`,
      transition: 'all 0.3s ease',
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
      .filter(([_, value]) => value !== undefined && value !== 'none' && value !== '0px' && value !== '0deg' && value !== '100%')
      .map(([key, value]) => {
        if (typeof value === 'string' && value.includes('rgba')) {
          return `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value};`;
        }
        return `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value};`;
      })
      .join('\n  ');
  };

  // Generate Component Code
  const generateComponentCode = () => {
    const css = generateCSS();
    return `// ${componentName}.jsx
import React from 'react';

const ${componentName} = ({ className, children, ...props }) => {
  const styles = {
    ${css}
  };

  return (
    <div style={styles} className={className} {...props}>
      {children || (
        <>
          <h3 style={{ margin: 0, color: '${styles.textColor}' }}>
            ${componentName}
          </h3>
          <p style={{ opacity: 0.7, margin: '8px 0 0 0', color: '${styles.textColor}' }}>
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
      classes.push(`bg-gradient-to-br from-[${styles.gradientFrom}] to-[${styles.gradientTo}]`);
    } else {
      classes.push(`bg-[${styles.bgColor}]`);
    }
    
    classes.push(`text-[${styles.textColor}]`);
    classes.push(`px-[${styles.paddingX}px] py-[${styles.paddingY}px]`);
    classes.push(`w-[${styles.width}%] max-w-[${styles.maxWidth}px]`);
    classes.push(`mx-auto rounded-[${styles.borderRadius}px]`);
    classes.push(`border-[${styles.borderWidth}px] border-[${styles.borderColor}]`);
    classes.push(`shadow-[0_${styles.shadowSize}px_${styles.shadowSize*2}px_rgba(0,0,0,${styles.shadowOpacity/100})]`);
    classes.push(`text-[${styles.textSize}] font-[${styles.textWeight}] text-${styles.textAlign}`);
    classes.push(`opacity-[${styles.textOpacity/100}]`);
    
    if (styles.blur !== '0') {
      classes.push(`backdrop-blur-[${styles.blur}px]`);
    }
    
    if (styles.glowSize !== '0') {
      classes.push(`shadow-[0_0_${styles.glowSize}px_${styles.glowColor}]`);
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
    
    return classes.join(' ');
  };

  const code = generateComponentCode();
  const tailwindClasses = generateTailwindClasses();

  const copyCode = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const copyTailwind = () => {
    navigator.clipboard.writeText(tailwindClasses).then(() => {
      setCopiedTailwind(true);
      setTimeout(() => setCopiedTailwind(false), 2000);
    });
  };

  const downloadComponent = () => {
    const blob = new Blob([code], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${componentName}.jsx`;
    a.click();
  };

  // Slider component
  const SliderControl = ({ label, value, min, max, step, onChange, suffix = '', icon: Icon }) => (
    <div className="space-y-1">
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
        className="w-full h-1 bg-slate-800 rounded-full appearance-none cursor-pointer accent-brand-500
          [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3
          [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brand-500
          [&::-webkit-slider-thumb]:shadow-glow [&::-webkit-slider-thumb]:transition-all
          [&::-webkit-slider-thumb]:hover:scale-110"
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
        className="w-7 h-7 rounded border border-white/10 bg-transparent cursor-pointer hover:scale-110 transition-transform"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 bg-[#0F172A] border border-white/5 rounded px-2 py-0.5 text-[10px] font-mono text-white focus:ring-1 focus:ring-brand-500 outline-none"
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
        className="bg-[#0F172A] border border-white/5 rounded px-2 py-0.5 text-[10px] text-white focus:ring-1 focus:ring-brand-500 outline-none"
      >
        {options.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );

  return (
    <div className={`h-[calc(100vh-6rem)] ${isFullscreen ? 'fixed inset-0 z-50 bg-[#050816] p-4' : ''}`}>
      <div className="flex flex-col h-full gap-3">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-white">Design Studio</h1>
            <input
              type="text"
              value={componentName}
              onChange={(e) => setComponentName(e.target.value)}
              className="bg-[#0F172A] border border-white/10 rounded-lg px-3 py-1 text-sm text-white focus:ring-1 focus:ring-brand-500 outline-none w-40"
              placeholder="Component name"
            />
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handleUndo}
              disabled={historyIndex === 0}
              className="p-1.5 rounded hover:bg-white/5 disabled:opacity-30 transition"
            >
              <Undo className="w-4 h-4 text-slate-400" />
            </button>
            <button
              onClick={handleRedo}
              disabled={historyIndex === history.length - 1}
              className="p-1.5 rounded hover:bg-white/5 disabled:opacity-30 transition"
            >
              <Redo className="w-4 h-4 text-slate-400" />
            </button>
            <button
              onClick={resetStyles}
              className="p-1.5 rounded hover:bg-white/5 transition"
            >
              <RefreshCw className="w-4 h-4 text-slate-400" />
            </button>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 rounded hover:bg-white/5 transition"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4 text-slate-400" /> : <Maximize2 className="w-4 h-4 text-slate-400" />}
            </button>
            <button
              onClick={downloadComponent}
              className="p-1.5 rounded hover:bg-white/5 transition"
            >
              <Download className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Main Layout */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3 min-h-0">
          {/* Left Panel - Controls */}
          <div className="lg:col-span-3 bg-[#0F172A] border border-white/5 rounded-xl overflow-hidden flex flex-col">
            <div className="flex border-b border-white/5">
              {['properties', 'tailwind'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 px-3 py-1.5 text-[10px] font-medium transition ${
                    activeTab === tab 
                      ? 'bg-brand-500/20 text-brand-400 border-b-2 border-brand-400' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tab === 'properties' ? '🎨 Properties' : '📋 Tailwind'}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-4">
              {activeTab === 'properties' ? (
                <>
                  {/* Background */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                      <Palette className="w-3 h-3" /> Background
                    </div>
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
                  </div>

                  {/* Text */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                      <Type className="w-3 h-3" /> Typography
                    </div>
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
                      onChange={(v) => handleChange('textSize', `${v}px`)}
                    />
                    <SelectControl
                      label="Weight"
                      value={styles.textWeight}
                      options={['300', '400', '500', '600', '700', '800']}
                      onChange={(v) => handleChange('textWeight', v)}
                    />
                    <SelectControl
                      label="Align"
                      value={styles.textAlign}
                      options={['left', 'center', 'right']}
                      onChange={(v) => handleChange('textAlign', v)}
                    />
                    <SliderControl
                      label="Opacity"
                      value={styles.textOpacity}
                      min={0}
                      max={100}
                      step={1}
                      suffix="%"
                      onChange={(v) => handleChange('textOpacity', v)}
                    />
                  </div>

                  {/* Layout */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                      <Layout className="w-3 h-3" /> Layout
                    </div>
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
                    <SliderControl
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
                    />
                    <SliderControl
                      label="Radius"
                      value={styles.borderRadius}
                      min={0}
                      max={48}
                      step={2}
                      suffix="px"
                      onChange={(v) => handleChange('borderRadius', v)}
                    />
                  </div>

                  {/* Effects */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                      <Eye className="w-3 h-3" /> Effects
                    </div>
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
                    <SliderControl
                      label="Shadow Opacity"
                      value={styles.shadowOpacity}
                      min={0}
                      max={100}
                      step={5}
                      suffix="%"
                      onChange={(v) => handleChange('shadowOpacity', v)}
                    />
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
                  </div>

                  {/* Animation */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                      <Sparkles className="w-3 h-3" /> Animation
                    </div>
                    <SelectControl
                      label="Type"
                      value={styles.animationType}
                      options={['none', 'pulse', 'bounce', 'float', 'glow', 'shimmer', 'wiggle', 'spin']}
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
                        <SelectControl
                          label="Iteration"
                          value={styles.animationIteration}
                          options={['infinite', '1', '2', '3', '4', '5']}
                          onChange={(v) => handleChange('animationIteration', v)}
                        />
                      </>
                    )}
                  </div>

                  {/* Transform */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                      <Move className="w-3 h-3" /> Transform
                    </div>
                    <SliderControl
                      label="Rotate"
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
                    <SliderControl
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
                    />
                  </div>
                </>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">Tailwind Classes</span>
                    <button
                      onClick={copyTailwind}
                      className="text-[10px] text-brand-400 hover:text-brand-300 flex items-center gap-1"
                    >
                      {copiedTailwind ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      Copy
                    </button>
                  </div>
                  <div className="bg-[#0F172A]/50 border border-white/5 rounded-lg p-3">
                    <pre className="text-[10px] font-mono text-green-300 overflow-auto whitespace-pre-wrap break-all">
                      {tailwindClasses}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Center Panel - Canvas */}
          <div className="lg:col-span-6 bg-[#0F172A] border border-white/5 rounded-xl p-6 flex items-center justify-center relative overflow-hidden">
            <div 
              className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"
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
                fontSize: styles.textSize,
                fontWeight: styles.textWeight,
                textAlign: styles.textAlign,
                opacity: styles.textOpacity / 100,
                backdropFilter: styles.blur !== '0' ? `blur(${styles.blur}px)` : 'none',
                transform: `rotate(${styles.rotate}deg) scale(${styles.scale/100}) translate(${styles.translateX}px, ${styles.translateY}px)`,
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
              <h3 style={{ margin: 0, color: styles.textColor, fontSize: styles.textSize }}>
                {componentName}
              </h3>
              <p style={{ opacity: 0.7, margin: '8px 0 0 0', color: styles.textColor, fontSize: '14px' }}>
                Built with Design Studio
              </p>
              
              {/* Hover indicator */}
              {isHovered && (
                <div className="absolute top-2 right-2 text-[8px] text-slate-500 bg-black/50 px-2 py-0.5 rounded-full">
                  ✦ Interactive
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Code */}
          <div className="lg:col-span-3 bg-[#0F172A] border border-white/5 rounded-xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-3 py-2 border-b border-white/5">
              <span className="text-[10px] font-medium text-slate-400">React Component</span>
              <button
                onClick={copyCode}
                className="text-[10px] text-brand-400 hover:text-brand-300 flex items-center gap-1"
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                Copy
              </button>
            </div>
            <div className="flex-1 overflow-auto p-3">
              <pre className="text-[10px] font-mono text-green-300 whitespace-pre-wrap leading-relaxed">
                {code}
              </pre>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(2deg); }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(94, 106, 210, 0.3); }
          50% { box-shadow: 0 0 60px rgba(94, 106, 210, 0.6); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes wiggle {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }
      `}</style>
    </div>
  );
}