import { useState, useEffect, useRef, useCallback } from 'react';
import FormatConverter from '../components/media/FormatConverter';
import ImageCompressor from '../components/media/ImageCompressor';
import SvgPurifier from '../components/media/SvgPurifier';
import { useRecent } from '../hooks/useStorage';
import { useNotifications } from '../context/NotificationContext';
import { useWorkbench } from '../context/WorkbenchContext';
import { 
  HardDrive, Clock, Layers, Star, Trash2, Download, Eye,
  ArrowRight, Sparkles, Zap, Shield, Globe, Cpu,
  Upload, Image, FileImage, CheckCircle, XCircle,
  Loader2, PanelLeft, PanelRight, Maximize2, Minimize2,
  Sliders, Settings, Grid, List, FolderOpen, RefreshCw,
  Plus, Minus, RotateCw, Crop, AlignLeft, AlignCenter, AlignRight, Search
} from 'lucide-react';

export default function MediaDesk() {
  const { state: workbenchState, dispatch: workbenchDispatch } = useWorkbench();
  const activeTool = workbenchState.activeTool;
  const setActiveTool = useCallback((tool) => {
    workbenchDispatch({ type: 'SET_ACTIVE_TOOL', payload: tool });
  }, [workbenchDispatch]);

  const [workspaceSearch, setWorkspaceSearch] = useState('');
  const { recent, addRecent } = useRecent();
  const { addNotification } = useNotifications();
  const [showRecentModal, setShowRecentModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [viewMode, setViewMode] = useState('grid');
  const selectedFiles = workbenchState.selectedFiles || [];
  const [isDragging, setIsDragging] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const isFullscreen = workbenchState.isFullscreen;
  const setIsFullscreen = (val) => workbenchDispatch({ type: 'SET_FULLSCREEN', payload: val });
  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);

  // Sync mediaFile from context to selectedFiles
  useEffect(() => {
    if (workbenchState.mediaFile) {
      const exists = selectedFiles.some(f => f.name === workbenchState.mediaFile.name);
      if (!exists) {
        workbenchDispatch({ type: 'ADD_FILES', payload: [workbenchState.mediaFile] });
      }
    }
  }, [workbenchState.mediaFile, selectedFiles, workbenchDispatch]);

  // Simulate processing with progress
  const simulateProcessing = useCallback(() => {
    setIsProcessing(true);
    setProcessingProgress(0);
    const interval = setInterval(() => {
      setProcessingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsProcessing(false);
          addNotification({
            title: 'Processing Complete',
            description: 'All files have been processed successfully',
            type: 'success',
            icon: 'check'
          });
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);
    return () => clearInterval(interval);
  }, [addNotification]);

  // Drag and drop handlers
  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleFiles = useCallback((files) => {
    workbenchDispatch({ type: 'ADD_FILES', payload: files });
    if (files.length > 0) {
      workbenchDispatch({ type: 'SET_MEDIA_FILE', payload: files[0] });
    }
    addNotification({
      title: 'Files Added',
      description: `${files.length} file(s) added to workspace`,
      type: 'info',
      icon: 'upload'
    });
    simulateProcessing();
  }, [addNotification, simulateProcessing, workbenchDispatch]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFiles(files);
    }
  }, [handleFiles]);

  const selectFile = useCallback((file) => {
    workbenchDispatch({ type: 'SET_MEDIA_FILE', payload: file });
    addNotification({
      title: 'File Loaded',
      description: `Loaded ${file.name} into ${activeTool === 'converter' ? 'Converter' : activeTool === 'compressor' ? 'Compressor' : 'SVG → React'}`,
      type: 'success',
      icon: 'check'
    });
  }, [workbenchDispatch, activeTool, addNotification]);

  const handleFileSelect = useCallback((e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      handleFiles(files);
    }
  }, [handleFiles]);

  const removeFile = useCallback((index) => {
    workbenchDispatch({ type: 'REMOVE_FILE', payload: index });
  }, [workbenchDispatch]);

  const clearAllFiles = useCallback(() => {
    workbenchDispatch({ type: 'CLEAR_FILES' });
    setProcessingProgress(0);
    setIsProcessing(false);
  }, [workbenchDispatch]);

  const formatFileSize = useCallback((bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }, []);

  const getFileIcon = useCallback((file) => {
    const type = file.type?.split('/')[0] || 'file';
    switch(type) {
      case 'image': return <Image className="w-4 h-4" />;
      default: return <FileImage className="w-4 h-4" />;
    }
  }, []);

  const renderTool = () => {
    switch (activeTool) {
      case 'converter':
        return <FormatConverter onComplete={addRecent} />;
      case 'compressor':
        return <ImageCompressor onComplete={addRecent} />;
      case 'svg':
        return <SvgPurifier />;
      default:
        return null;
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
    return date.toLocaleDateString();
  };

  const tools = [
    { id: 'converter', label: 'Converter', icon: Layers, description: 'Convert image formats' },
    { id: 'compressor', label: 'Compressor', icon: HardDrive, description: 'Reduce image size' },
    { id: 'svg', label: 'SVG → React', icon: Cpu, description: 'Convert SVG to components' },
  ];

  return (
    <div className={`space-y-6 animate-slide-up ${isFullscreen ? 'fixed inset-0 z-[60] bg-[#0A0A0F] p-6 overflow-y-auto' : ''}`}>
      {/* Header with Gradient */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-500/10 via-secondary-500/5 to-transparent border border-white/5 p-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary-500/10 rounded-full blur-3xl animate-float-medium" />
        
        <div className="relative flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              FuncLexa Media Desk
              <span className="text-xs font-normal text-slate-400 bg-white/5 px-3 py-1 rounded-full border border-white/5 flex items-center gap-1">
                <Globe className="w-3 h-3" />
                FuncLexa Client-side
              </span>
              {isProcessing && (
                <span className="text-xs font-normal text-secondary-400 bg-secondary-500/20 px-3 py-1 rounded-full border border-secondary-500/20 flex items-center gap-2 animate-pulse">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Processing...
                </span>
              )}
            </h1>
            <p className="text-sm text-slate-400 mt-1 flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-green-400" />
              FuncLexa secure processing • 100% private • {selectedFiles.length} files in workspace
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
              <div className={`w-1.5 h-1.5 rounded-full ${isProcessing ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'}`} />
              {isProcessing ? `Processing ${Math.round(processingProgress)}%` : 'Ready'}
            </div>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-xl hover:bg-white/5 transition-all duration-300 hover:scale-110"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4 text-slate-400" /> : <Maximize2 className="w-4 h-4 text-slate-400" />}
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        {isProcessing && (
          <div className="relative mt-4">
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(processingProgress, 100)}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 mt-1">
              <span>Processing files...</span>
              <span>{Math.round(Math.min(processingProgress, 100))}%</span>
            </div>
          </div>
        )}
      </div>

      {/* Tool switcher with view controls */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          {tools.map(({ id, label, icon: Icon, description }) => (
            <button
              key={id}
              onClick={() => setActiveTool(id)}
              className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                activeTool === id
                  ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-[0_0_30px_rgba(99,102,241,0.3)] scale-[1.02]'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className={`w-4 h-4 ${activeTool === id ? 'text-white' : 'text-slate-500'}`} />
              <span>{label}</span>
              <span className="text-[10px] text-slate-400 hidden sm:inline">{description}</span>
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="p-2 rounded-xl hover:bg-white/5 transition-all duration-300 hover:scale-110"
          >
            {viewMode === 'grid' ? <List className="w-4 h-4 text-slate-400" /> : <Grid className="w-4 h-4 text-slate-400" />}
          </button>
          <button
            onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
            className={`p-2 rounded-xl transition-all duration-300 hover:scale-110 ${
              showAdvancedSettings ? 'bg-primary-500/20 text-primary-400' : 'hover:bg-white/5 text-slate-400'
            }`}
          >
            <Settings className="w-4 h-4" />
          </button>
          {selectedFiles.length > 0 && (
            <button
              onClick={clearAllFiles}
              className="p-2 rounded-xl hover:bg-red-500/10 transition-all duration-300 hover:scale-110 text-slate-400 hover:text-red-400"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Tool content */}
      <div className="animate-scale-in">
        {renderTool()}
      </div>

      {/* Advanced Settings Panel */}
      {showAdvancedSettings && (
        <div className="panel-3d p-5 animate-slide-up">
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-primary-400" />
            Advanced Settings
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-xs text-slate-400">Output Quality</label>
              <div className="flex items-center gap-3">
                <input type="range" min="1" max="100" defaultValue="92" className="flex-1 accent-primary-500" />
                <span className="text-xs text-white font-mono">92%</span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs text-slate-400">Max Width</label>
              <select className="w-full bg-[#0F172A] border border-white/10 rounded-lg px-3 py-2 text-sm text-white">
                <option>1920px</option>
                <option>2560px</option>
                <option>3840px</option>
                <option>Custom</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs text-slate-400">Preserve Metadata</label>
              <div className="flex items-center gap-3">
                <button className="px-4 py-2 bg-primary-500/20 text-primary-400 rounded-lg text-sm border border-primary-500/20">Yes</button>
                <button className="px-4 py-2 bg-white/5 text-slate-400 rounded-lg text-sm hover:bg-white/10 transition">No</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom row - File Workspace & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* File Workspace */}
        <div className="lg:col-span-2 panel-3d p-5 space-y-3">
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2 flex-shrink-0">
              <FolderOpen className="w-3 h-3" />
              Workspace
              <span className="text-[10px] text-slate-500">({selectedFiles.length} files)</span>
            </h3>

            {/* Workspace Search Input */}
            {selectedFiles.length > 0 && (
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search workspace files..."
                  value={workspaceSearch}
                  onChange={(e) => setWorkspaceSearch(e.target.value)}
                  className="w-full bg-[#0F172A] border border-white/10 rounded-lg pl-8 pr-3 py-1 text-xs text-white placeholder-slate-500 focus:ring-1 focus:ring-primary-500 outline-none transition"
                />
              </div>
            )}

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-xs text-primary-400 hover:text-primary-300 flex items-center gap-1 transition"
              >
                <Plus className="w-3 h-3" /> Add Files
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,.svg"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          </div>

          {/* Drop Zone */}
          <div
            ref={dropZoneRef}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={selectedFiles.length === 0 ? () => fileInputRef.current?.click() : undefined}
            className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 ${
              selectedFiles.length === 0 ? 'cursor-pointer hover:border-primary-500/50 hover:bg-white/[0.07]' : ''
            } ${
              isDragging 
                ? 'border-primary-500/50 bg-primary-500/10 scale-[1.02]' 
                : 'border-white/10 bg-white/5'
            }`}
          >
            {selectedFiles.length === 0 ? (
              <div className="text-center transition pointer-events-none">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3">
                  <Upload className="w-8 h-8 text-slate-500" />
                </div>
                <p className="text-sm text-slate-400">Drop files here or click to upload</p>
                <p className="text-xs text-slate-500 mt-1">Supports images, SVGs, and more</p>
              </div>
            ) : (
              <div className={`grid ${viewMode === 'grid' ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4' : 'grid-cols-1'} gap-3`}>
                {selectedFiles.filter(file => file.name.toLowerCase().includes(workspaceSearch.toLowerCase())).map((file, index) => {
                  const isActive = workbenchState.mediaFile && workbenchState.mediaFile.name === file.name;
                  return (
                    <div
                      key={index}
                      onClick={() => selectFile(file)}
                      className={`group relative border rounded-xl p-3 transition-all duration-300 hover:scale-[1.02] cursor-pointer ${
                        isActive 
                          ? 'bg-primary-500/10 border-primary-500/80 shadow-[0_0_15px_rgba(99,102,241,0.25)]' 
                          : 'bg-[#0F172A]/50 border-white/5 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          isActive 
                            ? 'bg-gradient-to-br from-primary-500/30 to-secondary-500/30' 
                            : 'bg-gradient-to-br from-primary-500/20 to-secondary-500/20'
                        }`}>
                          {getFileIcon(file)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={`text-xs truncate ${isActive ? 'text-white font-medium' : 'text-slate-300'}`}>{file.name}</div>
                          <div className="text-[10px] text-slate-400">{formatFileSize(file.size)}</div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const originalIndex = selectedFiles.findIndex(f => f.name === file.name);
                            if (originalIndex !== -1) removeFile(originalIndex);
                          }}
                          className="opacity-0 group-hover:opacity-100 transition p-1 rounded-lg hover:bg-red-500/10 text-slate-400 hover:text-red-400"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      {isProcessing && index < 3 && (
                        <div className="mt-2 h-0.5 bg-white/5 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(processingProgress + (index * 10), 100)}%` }}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
                {selectedFiles.filter(file => file.name.toLowerCase().includes(workspaceSearch.toLowerCase())).length === 0 && (
                  <div className="col-span-full py-8 text-center text-slate-400 text-xs">
                    No files match "{workspaceSearch}"
                  </div>
                )}
                {selectedFiles.length > 0 && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-white/10 rounded-xl p-3 hover:border-primary-500/50 transition-all duration-300 flex items-center justify-center text-slate-400 hover:text-primary-400"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Quick Stats */}
          {selectedFiles.length > 0 && (
            <div className="flex flex-wrap items-center gap-4 text-[10px] text-slate-400 pt-2 border-t border-white/5">
              <span>Total: {selectedFiles.length} files</span>
              <span>Size: {formatFileSize(selectedFiles.reduce((acc, f) => acc + f.size, 0))}</span>
              <span>Status: {isProcessing ? 'Processing...' : 'Ready'}</span>
              {isProcessing && (
                <div className="flex items-center gap-1 text-primary-400">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  {Math.round(processingProgress)}%
                </div>
              )}
            </div>
          )}
        </div>

        {/* Activity & Quick Tools */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <div className="panel-3d p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-3 h-3" />
                Recent Activity
              </h3>
              {recent.length > 0 && (
                <button
                  onClick={() => setShowRecentModal(true)}
                  className="text-xs text-primary-400 hover:text-primary-300 transition"
                >
                  View All
                </button>
              )}
            </div>
            {recent.length === 0 ? (
              <div className="text-center py-6">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3">
                  <Clock className="w-6 h-6 text-slate-600" />
                </div>
                <p className="text-sm text-slate-500">No recent activity</p>
                <p className="text-xs text-slate-600">Convert or compress to get started</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {recent.slice(0, 4).map((conv, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition group">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-white truncate">{conv.fileName}</span>
                        <span className="text-[10px] text-slate-400 flex-shrink-0">{conv.from} → {conv.to}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-[10px] text-slate-500">{conv.size} KB</span>
                        <span className="text-[10px] text-green-400 flex items-center gap-1">
                          <ArrowRight className="w-2.5 h-2.5" />
                          {conv.reduction}% saved
                        </span>
                        <span className="text-[10px] text-slate-500">{formatTime(conv.timestamp)}</span>
                      </div>
                    </div>
                    <button className="opacity-0 group-hover:opacity-100 transition p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-white">
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Tools */}
          <div className="panel-3d p-5 space-y-3">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-3 h-3" />
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => setActiveTool('compressor')}
                className="text-left p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all group border border-white/5 hover:border-white/10"
              >
                <HardDrive className="w-4 h-4 text-primary-400 mb-1.5 group-hover:scale-110 transition" />
                <div className="text-sm text-white">Compressor</div>
                <div className="text-[10px] text-slate-400">Reduce image size</div>
              </button>
              <button 
                onClick={() => setActiveTool('svg')}
                className="text-left p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all group border border-white/5 hover:border-white/10"
              >
                <Cpu className="w-4 h-4 text-secondary-400 mb-1.5 group-hover:scale-110 transition" />
                <div className="text-sm text-white">SVG to React</div>
                <div className="text-[10px] text-slate-400">Convert SVG components</div>
              </button>
              <button 
                onClick={() => setActiveTool('converter')}
                className="text-left p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all group border border-white/5 hover:border-white/10"
              >
                <Layers className="w-4 h-4 text-accent-400 mb-1.5 group-hover:scale-110 transition" />
                <div className="text-sm text-white">Resizer</div>
                <div className="text-[10px] text-slate-400">Custom dimensions</div>
              </button>
              <button 
                onClick={() => {
                  addNotification({
                    title: 'Batch Processing',
                    description: 'Select multiple files to process them together',
                    type: 'info',
                    icon: 'layers'
                  });
                }}
                className="text-left p-3 rounded-xl bg-gradient-to-r from-primary-500/10 to-secondary-500/10 hover:from-primary-500/20 hover:to-secondary-500/20 transition-all group border border-white/5 hover:border-white/10"
              >
                <Sparkles className="w-4 h-4 text-yellow-400 mb-1.5 group-hover:scale-110 transition" />
                <div className="text-sm text-white">Batch Process</div>
                <div className="text-[10px] text-slate-400">Multiple files</div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Modal */}
      {showRecentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl" onClick={() => setShowRecentModal(false)}>
          <div className="panel-3d max-w-3xl w-full max-h-[80vh] overflow-hidden animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-[#0F172A]/95 backdrop-blur-xl border-b border-white/10 p-5 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Activity History</h2>
                  <p className="text-xs text-slate-400">{recent.length} items</p>
                </div>
              </div>
              <button onClick={() => setShowRecentModal(false)} className="p-2 rounded-xl hover:bg-white/5 transition text-slate-400 hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-y-auto p-5 max-h-[60vh] space-y-2">
              {recent.length === 0 ? (
                <div className="text-center py-12 text-slate-500">No recent activity</div>
              ) : (
                recent.map((conv, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-white/5 hover:bg-white/10 rounded-xl transition border border-white/5 hover:border-white/10 group">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium">{conv.fileName}</span>
                        <span className="text-xs text-slate-400">{conv.from} → {conv.to}</span>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-xs">
                        <span className="text-slate-500">{conv.size} KB</span>
                        <span className="text-green-400">{conv.reduction}% saved</span>
                        <span className="text-slate-500">{formatTime(conv.timestamp)}</span>
                      </div>
                    </div>
                    <button className="p-2 rounded-lg hover:bg-white/10 transition text-slate-400 hover:text-white">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}