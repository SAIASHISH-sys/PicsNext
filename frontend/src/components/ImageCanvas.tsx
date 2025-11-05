import { useRef, useEffect, useState } from 'react';
import { useImageLoader } from '../hooks/useImageLoader';
import { useImageFilters } from '../hooks/useImageFilters';

interface ImageCanvasProps {
  selectedTool: string;
  brightness: number;
  contrast: number;
  saturation: number;
  onHistoryChange: (action: string) => void;
}

const ImageCanvas = ({ 
  brightness, 
  contrast, 
  saturation,
  onHistoryChange 
}: ImageCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Zoom & Pan state
  const [zoom, setZoom] = useState(1); // 1 = 100%
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 }); // Pan offset in pixels
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef<{ x: number; y: number; offsetX: number; offsetY: number } | null>(null);
  const MIN_ZOOM = 0.1;
  const MAX_ZOOM = 8;
  const ZOOM_STEP = 0.1;
  
  // Use the custom image loader hook
  const {
    image,
    originalImageData,
    isLoading,
    error,
    loadImage,
    clearImage,
    setOriginalImageData,
  } = useImageLoader();

  // Use the custom filters hook
  const { applyFilters, resetFilterRef } = useImageFilters({
    brightness,
    contrast,
    saturation,
  });

  useEffect(() => {
    if (image && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Ensure canvas matches image size whenever a new image loads
      if (canvas.width !== image.width || canvas.height !== image.height) {
        canvas.width = image.width;
        canvas.height = image.height;
      }

      // Draw original image
      ctx.drawImage(image, 0, 0, image.width, image.height);

      // Save original image data on first load
      if (!originalImageData) {
        setOriginalImageData(ctx.getImageData(0, 0, image.width, image.height));
      } else {
        // Apply filters
        applyFilters(ctx, originalImageData);
      }
    }
  }, [image, brightness, contrast, saturation, originalImageData, applyFilters]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await loadImage(file);

      // Reset zoom and pan on new image
      setZoom(1);
      setPanOffset({ x: 0, y: 0 });
      
      // Reset filter reference
      resetFilterRef();

      onHistoryChange('Image uploaded');
    } catch (err) {
      console.error('Failed to load image:', err);
    }
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'edited-image.png';
      a.click();
      URL.revokeObjectURL(url);
      // Download doesn't modify image, so no history needed
    });
  };

  const handleClearImage = () => {
    clearImage();
    setZoom(1);
    setPanOffset({ x: 0, y: 0 });
    resetFilterRef();
    onHistoryChange('Image cleared');
  };

  // Zoom helpers - No history tracking for zoom changes
  const setZoomClamped = (next: number) => {
    const clamped = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, Number.isFinite(next) ? next : 1));
    setZoom(clamped);
  };

  const handleZoomIn = () => setZoomClamped(zoom + ZOOM_STEP);
  const handleZoomOut = () => setZoomClamped(zoom - ZOOM_STEP);
  const handleZoomReset = () => {
    setZoomClamped(1);
    setPanOffset({ x: 0, y: 0 });
  };

  const handleWheel: React.WheelEventHandler<HTMLDivElement> = (e) => {
    // Zoom when holding Ctrl (or Meta on Mac) to avoid hijacking normal scroll
    if (!(e.ctrlKey || e.metaKey)) return;
    e.preventDefault();

    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const offsetX = e.clientX - rect.left; // cursor position within container
    const offsetY = e.clientY - rect.top;

    const oldZoom = zoom;
    const delta = -Math.sign(e.deltaY) * ZOOM_STEP; // wheel up -> zoom in
    const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, oldZoom + delta));
    if (Math.abs(newZoom - oldZoom) < 1e-6) return;

    // Compute content coords under cursor before zoom
    const contentX = (container.scrollLeft + offsetX) / oldZoom;
    const contentY = (container.scrollTop + offsetY) / oldZoom;

    setZoom(newZoom);

    // After zooming, adjust scroll so the same content point remains under cursor
    // Use requestAnimationFrame to ensure React applied state updates/styles
    requestAnimationFrame(() => {
      container.scrollLeft = contentX * newZoom - offsetX;
      container.scrollTop = contentY * newZoom - offsetY;
    });
  };

  // Drag-to-pan handlers (works at any zoom level)
  const handleDragStart: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (e.button !== 0) return; // left button only
    if (!image) return;
    
    isDraggingRef.current = true;
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      offsetX: panOffset.x,
      offsetY: panOffset.y,
    };
  };

  const handleDragMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (!isDraggingRef.current || !dragStartRef.current) return;
    
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    
    setPanOffset({
      x: dragStartRef.current.offsetX + dx,
      y: dragStartRef.current.offsetY + dy,
    });
  };

  const handleDragEnd = () => {
    isDraggingRef.current = false;
    dragStartRef.current = null;
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-4 overflow-auto">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />
      
      {/* Error Message */}
      {error && (
        <div className="mb-4 px-4 py-3 bg-red-900/50 border border-red-700 text-red-200 rounded-lg">
          <p className="font-medium">Error: {error}</p>
        </div>
      )}
      
      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#8b3dff]"></div>
          <p className="text-gray-400 font-medium">Loading image...</p>
        </div>
      )}
      
      {!image && !isLoading ? (
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="text-center">
            <div className="mx-auto w-32 h-32 bg-gray-800 rounded-2xl flex items-center justify-center mb-6">
              <svg
                className="w-16 h-16 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="mt-2 text-xl font-semibold text-white">Start creating</h3>
            <p className="mt-2 text-sm text-gray-400">Upload an image to begin editing</p>
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-8 py-3 bg-[#8b3dff] text-white rounded-lg hover:bg-[#7c2ef5] transition-all font-medium shadow-lg shadow-purple-900/30 hover:shadow-xl hover:shadow-purple-900/40 transform hover:scale-105"
          >
            Upload Image
          </button>
        </div>
      ) : image && !isLoading ? (
        <div className="flex flex-col items-center space-y-4 w-full h-full">
          {/* Top Controls Bar */}
          <div className="flex flex-wrap gap-3 items-center justify-center px-4 py-2 bg-gray-800/50 rounded-lg backdrop-blur-sm">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition-colors text-sm font-medium flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Upload New
            </button>
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-[#8b3dff] text-white rounded-lg hover:bg-[#7c2ef5] transition-colors text-sm font-medium flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download
            </button>
            <button
              onClick={handleClearImage}
              className="px-4 py-2 bg-gray-700 text-gray-200 rounded-lg hover:bg-red-600 transition-colors text-sm font-medium flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Clear
            </button>
            
            <div className="h-6 w-px bg-gray-700" />
            
            {/* Zoom controls */}
            <div className="flex items-center gap-2 bg-gray-700/50 px-3 py-1.5 rounded-lg">
              <button
                onClick={handleZoomOut}
                className="p-1.5 rounded-md hover:bg-gray-600 text-gray-300 hover:text-white transition"
                title="Zoom out"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
                </svg>
              </button>
              <input
                type="range"
                min={MIN_ZOOM}
                max={MAX_ZOOM}
                step={ZOOM_STEP}
                value={zoom}
                onChange={(e) => setZoomClamped(parseFloat(e.target.value))}
                className="w-32 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-[#8b3dff]"
              />
              <button
                onClick={handleZoomIn}
                className="p-1.5 rounded-md hover:bg-gray-600 text-gray-300 hover:text-white transition"
                title="Zoom in"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
              </button>
              <span className="text-sm text-gray-300 w-14 text-center font-mono tabular-nums">{Math.round(zoom * 100)}%</span>
              <button
                onClick={handleZoomReset}
                className="ml-1 px-2 py-1 rounded-md hover:bg-gray-600 text-gray-300 hover:text-white text-xs transition"
                title="Reset zoom"
              >
                Reset
              </button>
            </div>
          </div>
          
          {/* Canvas Container */}
          <div
            ref={containerRef}
            onWheel={handleWheel}
            onMouseDown={handleDragStart}
            onMouseMove={handleDragMove}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            className={`flex-1 w-full overflow-hidden rounded-lg ${image ? (isDraggingRef.current ? 'cursor-grabbing' : 'cursor-grab') : ''}`}
            style={{
              backgroundImage: 'radial-gradient(circle, #374151 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          >
            <div className="min-h-full flex items-center justify-center p-8">
              <div className="shadow-2xl rounded-lg overflow-visible" style={{
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              }}>
                <canvas
                  ref={canvasRef}
                  className="block"
                  style={{ 
                    transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoom})`, 
                    transformOrigin: '0 0' 
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ImageCanvas;
