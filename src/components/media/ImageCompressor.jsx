import { useState, useEffect } from 'react';
import { useImageProcessor } from '../../hooks/useImageProcessor';
import { Download, Shrink } from 'lucide-react';

export default function ImageCompressor({ onComplete }) {
  const { compressImage, processing, previewUrl, originalSize, processedSize } = useImageProcessor();
  const [file, setFile] = useState(null);
  const [quality, setQuality] = useState(0.8);

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (f) setFile(f);
  };

  const handleCompress = () => { if (file) compressImage(file, quality); };

  const handleDownload = () => {
    if (previewUrl) {
      const a = document.createElement('a');
      a.href = previewUrl;
      a.download = 'compressed.webp';
      a.click();
    }
  };

  useEffect(() => {
    if (previewUrl && processedSize > 0 && originalSize > 0 && file) {
      const reduction = ((1 - processedSize / originalSize) * 100).toFixed(1);
      onComplete?.({
        fileName: file.name,
        from: file.type.split('/')[1] || 'unknown',
        to: 'webp',
        size: (processedSize / 1024).toFixed(0),
        reduction,
        timestamp: Date.now(),
      });
    }
  }, [previewUrl, processedSize, originalSize, file, onComplete]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left – upload and controls */}
      <div className="panel p-5 space-y-5">
        <div className="flex items-center gap-3">
          <Shrink className="w-5 h-5 text-brand-400" />
          <span className="text-sm font-medium">Compression</span>
        </div>
        <label className="block w-full cursor-pointer">
          <div className="border-2 border-dashed border-white/10 rounded-lg p-4 text-center hover:border-brand-500/50 transition-colors">
            {file ? file.name : 'Select image'}
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </div>
        </label>
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
        <button
          onClick={handleCompress}
          disabled={!file || processing}
          className="w-full py-2 bg-brand-500 text-white font-medium rounded-lg hover:bg-brand-600 disabled:opacity-50 transition-colors"
        >
          {processing ? 'Compressing…' : 'Compress'}
        </button>
        {previewUrl && (
          <button
            onClick={handleDownload}
            className="w-full flex items-center justify-center gap-2 py-2 border border-white/10 rounded-lg hover:bg-white/5 transition-colors"
          >
            <Download className="w-4 h-4" /> Download
          </button>
        )}
      </div>

      {/* Right – preview and stats */}
      <div className="panel p-5 flex flex-col">
        <div className="flex-1 flex items-center justify-center bg-[#0F172A]/50 rounded-lg border border-white/5 min-h-[200px]">
          {previewUrl ? (
            <img src={previewUrl} alt="Compressed" className="max-h-full max-w-full object-contain" />
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
              <span className="text-slate-400">Compressed</span>
              <div className="font-mono text-white">{(processedSize / 1024).toFixed(1)} KB</div>
            </div>
            <div className="bg-[#0F172A]/60 rounded-lg p-2 text-center">
              <span className="text-slate-400">Saved</span>
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