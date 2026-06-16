import { useState, useEffect } from 'react';
import { useImageProcessor } from '../../hooks/useImageProcessor';
import { Download, Upload } from 'lucide-react';

const formats = ['png', 'jpeg', 'webp', 'ico', 'svg'];

export default function FormatConverter({ onComplete }) {
  const { processImage, processing, previewUrl, originalSize, processedSize } = useImageProcessor();
  const [file, setFile] = useState(null);
  const [targetFormat, setTargetFormat] = useState('webp');
  const [quality, setQuality] = useState(0.92);

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f) { setFile(f); processImage(f, targetFormat, quality); }
  };

  const handleConvert = () => { if (file) processImage(file, targetFormat, quality); };
  
  const handleDownload = () => {
    if (previewUrl) {
      const a = document.createElement('a');
      a.href = previewUrl;
      a.download = `converted.${targetFormat}`;
      a.click();
    }
  };

  // Save to localStorage when conversion completes
  useEffect(() => {
    if (previewUrl && processedSize > 0 && originalSize > 0 && file) {
      const reduction = ((1 - processedSize / originalSize) * 100).toFixed(1);
      onComplete?.({
        fileName: file.name,
        from: file.type.split('/')[1] || 'unknown',
        to: targetFormat,
        size: (processedSize / 1024).toFixed(0),
        reduction,
        timestamp: Date.now(),
      });
    }
  }, [previewUrl, processedSize, originalSize, file, targetFormat, onComplete]);

  // Check if image can be converted to SVG (only if it's a simple image)
  const isSvgConversion = targetFormat === 'svg';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left – Upload & controls */}
      <div className="panel p-5 space-y-5">
        <div className="flex items-center gap-3">
          <Upload className="w-5 h-5 text-brand-400" />
          <span className="text-sm font-medium">Source</span>
        </div>
        <label className="block w-full cursor-pointer">
          <div className="border-2 border-dashed border-white/10 rounded-lg p-4 text-center hover:border-brand-500/50 transition-colors">
            {file ? file.name : 'Drop or click to upload'}
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </div>
        </label>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 w-16">Format</span>
            <select
              value={targetFormat}
              onChange={(e) => setTargetFormat(e.target.value)}
              className="flex-1 bg-[#0F172A] border border-white/5 rounded-lg px-3 py-1.5 text-sm text-white"
            >
              {formats.map(f => (
                <option key={f} value={f}>
                  {f.toUpperCase()}
                  {f === 'svg' && ' (experimental)'}
                </option>
              ))}
            </select>
          </div>
          {!isSvgConversion && (
            <>
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400 w-16">Quality</span>
                <input
                  type="range"
                  min="0.1" max="1" step="0.05"
                  value={quality}
                  onChange={(e) => setQuality(parseFloat(e.target.value))}
                  className="flex-1 accent-brand-500"
                />
                <span className="text-xs text-slate-400 w-12">{quality.toFixed(2)}</span>
              </div>
            </>
          )}
          {isSvgConversion && (
            <div className="bg-brand-500/10 border border-brand-500/20 rounded-lg p-3 text-xs text-slate-300">
              <span className="text-brand-400">ⓘ</span> Convert to SVG (vector) – works best with PNG/JPEG
            </div>
          )}
        </div>
        <button
          onClick={handleConvert}
          disabled={processing || !file}
          className="w-full py-2 bg-brand-500 text-white font-medium rounded-lg hover:bg-brand-600 disabled:opacity-50 transition-colors"
        >
          {processing ? 'Processing…' : `Convert to ${targetFormat.toUpperCase()}`}
        </button>
        {previewUrl && (
          <button
            onClick={handleDownload}
            className="w-full flex items-center justify-center gap-2 py-2 border border-white/10 rounded-lg hover:bg-white/5 transition-colors"
          >
            <Download className="w-4 h-4" /> Download {targetFormat.toUpperCase()}
          </button>
        )}
      </div>

      {/* Right – Preview & stats */}
      <div className="panel p-5 flex flex-col">
        <div className="flex-1 flex items-center justify-center bg-[#0F172A]/50 rounded-lg border border-white/5 min-h-[200px]">
          {previewUrl ? (
            targetFormat === 'svg' ? (
              <div className="text-center">
                <div className="text-4xl mb-2">📄</div>
                <p className="text-sm text-slate-400">SVG conversion ready</p>
                <p className="text-xs text-slate-500 mt-1">Download to get the SVG file</p>
              </div>
            ) : (
              <img src={previewUrl} alt="Preview" className="max-h-full max-w-full object-contain" />
            )
          ) : (
            <span className="text-slate-500 text-sm">Preview</span>
          )}
        </div>
        {originalSize > 0 && (
          <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
            <div className="bg-[#0F172A]/60 rounded-lg p-2 text-center">
              <span className="text-slate-400">Original</span>
              <div className="font-mono text-white">{(originalSize / 1024).toFixed(1)} KB</div>
            </div>
            <div className="bg-[#0F172A]/60 rounded-lg p-2 text-center">
              <span className="text-slate-400">Converted</span>
              <div className="font-mono text-white">{(processedSize / 1024).toFixed(1)} KB</div>
            </div>
            <div className="bg-[#0F172A]/60 rounded-lg p-2 text-center">
              <span className="text-slate-400">Reduction</span>
              <div className="font-mono text-brand-400">
                {originalSize ? ((1 - processedSize / originalSize) * 100).toFixed(1) : 0}%
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}