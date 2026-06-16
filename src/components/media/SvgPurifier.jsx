import { useState, useEffect } from 'react';
import { useSvgParser } from '../../hooks/useSvgParser';
import { Wand2 } from 'lucide-react';
import { useWorkbench } from '../../context/WorkbenchContext';

export default function SvgPurifier() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const { parse } = useSvgParser();
  const { state: workbenchState } = useWorkbench();
  const file = workbenchState.mediaFile;

  useEffect(() => {
    if (file && file instanceof File && file.name.endsWith('.svg')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setInput(e.target.result);
        }
      };
      reader.readAsText(file);
    }
  }, [file]);

  const handleClean = () => setOutput(parse(input));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="panel p-5 space-y-4">
        <h3 className="text-sm font-medium flex items-center gap-2 text-slate-300">
          <Wand2 className="w-4 h-4 text-brand-400" /> Raw SVG
        </h3>
        <textarea
          className="w-full h-48 bg-[#0F172A] border border-white/5 rounded-lg p-3 font-mono text-sm text-slate-300 resize-none focus:ring-1 focus:ring-brand-500 outline-none"
          placeholder="Paste SVG code…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          onClick={handleClean}
          className="w-full py-2 bg-brand-500 text-white font-medium rounded-lg hover:bg-brand-600 transition-colors"
        >
          Convert to React
        </button>
      </div>
      <div className="panel p-5 flex flex-col">
        <h3 className="text-sm font-medium text-slate-300 mb-3">React Component</h3>
        <pre className="flex-1 p-3 bg-[#0F172A]/50 border border-white/5 rounded-lg font-mono text-sm text-green-300 overflow-auto whitespace-pre-wrap min-h-[200px]">
          {output || '// Cleaned code will appear here'}
        </pre>
      </div>
    </div>
  );
}
