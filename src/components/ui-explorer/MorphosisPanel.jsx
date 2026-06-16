import { useWorkbench } from '../../context/WorkbenchContext';
import LivePreviewCard from './LivePreviewCard';
import Terminal from '../ui/Terminal';
import { buildTailwindClasses } from '../../utils/tailwindClassBuilder';
import { Droplets, Box, Eye, RotateCcw } from 'lucide-react';

export default function MorphosisPanel() {
  const { state, updateMorphosis } = useWorkbench();
  const { morphosis } = state;

  const handleSliderChange = (key, value) => {
    updateMorphosis({ [key]: parseFloat(value) });
  };

  const resetToDefaults = () => {
    updateMorphosis({
      bgOpacity: 0.08,
      blur: 24,
      borderWidth: 1,
      borderOpacity: 0.12,
      shadowSize: 12,
      shadowOpacity: 0.2,
      radius: 16,
      gradientAngle: 135,
      gradientStart: '#6366F1',
      gradientStop: '#8B5CF6',
    });
  };

  const code = buildTailwindClasses(morphosis);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-up">
      {/* Sliders */}
      <div className="glass-panel p-6 space-y-8 relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-500 via-accent-cyan to-accent-violet" />
        <h3 className="text-lg font-semibold tracking-tight flex items-center gap-2 text-white">
          <Droplets className="w-5 h-5 text-accent-cyan" /> Multi‑Morphosis Engine
        </h3>

        <div className="space-y-6">
          <ControlGroup label="Glass Effect" icon={Droplets}>
            <SliderControl label="Opacity" value={morphosis.bgOpacity} min={0} max={0.3} step={0.01} onChange={(v) => handleSliderChange('bgOpacity', v)} />
            <SliderControl label="Blur (px)" value={morphosis.blur} min={0} max={40} step={1} onChange={(v) => handleSliderChange('blur', v)} />
          </ControlGroup>

          <ControlGroup label="Border & Edge" icon={Box}>
            <SliderControl label="Width (px)" value={morphosis.borderWidth} min={0} max={3} step={1} onChange={(v) => handleSliderChange('borderWidth', v)} />
            <SliderControl label="Opacity" value={morphosis.borderOpacity} min={0} max={0.3} step={0.01} onChange={(v) => handleSliderChange('borderOpacity', v)} />
            <SliderControl label="Radius" value={morphosis.radius} min={0} max={48} step={2} onChange={(v) => handleSliderChange('radius', v)} />
          </ControlGroup>

          <ControlGroup label="Shadow Depth" icon={Eye}>
            <SliderControl label="Size (px)" value={morphosis.shadowSize} min={0} max={40} step={2} onChange={(v) => handleSliderChange('shadowSize', v)} />
            <SliderControl label="Opacity" value={morphosis.shadowOpacity} min={0} max={0.5} step={0.01} onChange={(v) => handleSliderChange('shadowOpacity', v)} />
          </ControlGroup>
        </div>

        <button
          onClick={resetToDefaults}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mt-4"
        >
          <RotateCcw className="w-4 h-4" /> Reset all
        </button>
      </div>

      {/* Preview & Code */}
      <div className="lg:col-span-2 space-y-8">
        <div className="glass-panel p-6 relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent-violet to-accent-cyan" />
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 text-white">
            <Eye className="w-5 h-5 text-accent-cyan" /> Live Component
          </h3>
          <LivePreviewCard params={morphosis} />
        </div>
        <Terminal title="Generated Tailwind Code" code={code} />
      </div>
    </div>
  );
}

function ControlGroup({ label, icon: Icon, children }) {
  return (
    <div>
      <div className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-3">
        {Icon && <Icon className="w-4 h-4 text-slate-500" />}
        {label}
      </div>
      <div className="space-y-3 pl-1">{children}</div>
    </div>
  );
}

function SliderControl({ label, value, min, max, step, onChange }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between text-xs text-slate-400">
        <span>{label}</span>
        <span className="font-mono bg-slate-800/50 px-2 py-0.5 rounded text-brand-300">
          {typeof value === 'number' ? value.toFixed(step < 0.1 ? 2 : 0) : value}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-1.5 bg-slate-800 rounded-full appearance-none cursor-pointer
                   accent-brand-400
                   [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                   [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r
                   [&::-webkit-slider-thumb]:from-brand-400 [&::-webkit-slider-thumb]:to-accent-violet
                   [&::-webkit-slider-thumb]:shadow-glow"
      />
    </div>
  );
}