import { useRef, useEffect, useState, useCallback } from 'react';
import { useImageLoader } from '../hooks/useImageLoader';
import { useImageFilters } from '../hooks/useImageFilters';
import { useImageBlur } from '../hooks/useImageBlur';
import { useImageCrop } from '../hooks/useImageCrop';
import { useAppSelector } from '../store/hooks';

interface ImageCanvasProps {
  selectedTool: string;
  brightness: number;
  contrast: number;
  saturation: number;
  blur: number;
  onHistoryChange: (action: string) => void;
}

const ImageCanvas = ({ 
  selectedTool,
  brightness, 
  contrast, 
  saturation,
  blur,
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

  // Use the blur hook
  const { applyBlur } = useImageBlur({ blur });

  // Use the crop hook when crop tool is selected
  const {
    cropArea,
    handleMouseDown: handleCropMouseDown,
    handleMouseMove: handleCropMouseMove,
    handleMouseUp: handleCropMouseUp,
    handleApplyCrop,
    handleCancelCrop,
  } = useImageCrop({
    canvasRef,
    containerRef,
    isActive: selectedTool === 'crop',
    zoom,
    panOffset,
  });

  // Wrapper to apply crop and update the main canvas
  const handleApplyCropWrapper = useCallback(() => {
    const croppedCanvas = handleApplyCrop();
    if (!croppedCanvas || !canvasRef.current) return;

    // Convert the cropped canvas to a blob and reload it as the main image
    croppedCanvas.toBlob((blob) => {
      if (!blob) return;
      
      const img = new Image();
      img.onload = () => {
        loadImage(new File([blob], 'cropped.png', { type: 'image/png' }));
        resetFilterRef();
        onHistoryChange('Crop applied');
      };
      img.src = URL.createObjectURL(blob);
    });
  }, [handleApplyCrop, canvasRef, loadImage, resetFilterRef, onHistoryChange]);

  // Get rotation from Redux
  const rotation = useAppSelector((state) => state.imageEditor.present.rotation);
  
  // Store the base rotated image separately
  const rotatedImageRef = useRef<ImageData | null>(null);

  // Effect 1: Handle rotation and store the rotated image data
  useEffect(() => {
    if (!image || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Determine canvas dimensions based on rotation
    const isSideways = rotation === 90 || rotation === 270;
    const canvasWidth = isSideways ? image.height : image.width;
    const canvasHeight = isSideways ? image.width : image.height;

    // Create a temporary canvas for rotation
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvasWidth;
    tempCanvas.height = canvasHeight;
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return;

    // Apply rotation to temp canvas
    tempCtx.save();
    tempCtx.translate(canvasWidth / 2, canvasHeight / 2);
    const angleInRadians = (rotation * Math.PI) / 180;
    tempCtx.rotate(angleInRadians);
    tempCtx.drawImage(image, -image.width / 2, -image.height / 2);
    tempCtx.restore();

    // Store the rotated image data
    rotatedImageRef.current = tempCtx.getImageData(0, 0, canvasWidth, canvasHeight);
    
    // Set as original image data if not set yet
    if (!originalImageData) {
      setOriginalImageData(rotatedImageRef.current);
    }
    
    // Update canvas size
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    
  }, [image, rotation, originalImageData, setOriginalImageData]);

  // Effect 2: Apply filters and blur to the rotated image
  useEffect(() => {
    if (!canvasRef.current || !rotatedImageRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Ensure canvas matches rotated image size
    if (canvas.width !== rotatedImageRef.current.width || canvas.height !== rotatedImageRef.current.height) {
      canvas.width = rotatedImageRef.current.width;
      canvas.height = rotatedImageRef.current.height;
    }

    // Apply filters to the rotated image first
    applyFilters(ctx, rotatedImageRef.current);
    
    // Then apply blur if needed
    if (blur > 0) {
      const currentImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      applyBlur(ctx, currentImageData);
    }
  }, [rotation, brightness, contrast, saturation, blur, applyFilters, applyBlur]);

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
    // If crop tool is active, use crop handlers instead
    if (selectedTool === 'crop') {
      handleCropMouseDown(e);
      return;
    }
    
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
    // If crop tool is active, use crop handlers instead
    if (selectedTool === 'crop') {
      handleCropMouseMove(e);
      return;
    }
    
    if (!isDraggingRef.current || !dragStartRef.current) return;
    
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    
    setPanOffset({
      x: dragStartRef.current.offsetX + dx,
      y: dragStartRef.current.offsetY + dy,
    });
  };

  const handleDragEnd = () => {
    // If crop tool is active, use crop handlers instead
    if (selectedTool === 'crop') {
      handleCropMouseUp();
      return;
    }
    
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

            {/* Crop Action Buttons */}
            {selectedTool === 'crop' && (
              <>
                <div className="h-6 w-px bg-gray-700" />
                <div className="text-sm text-gray-400">
                  {cropArea ? `Crop: ${Math.round(cropArea.width)} x ${Math.round(cropArea.height)}` : 'Drag to create crop area'}
                </div>
                {cropArea && (
                  <>
                    <button
                      onClick={handleApplyCropWrapper}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-colors text-sm font-medium flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Apply Crop
                    </button>
                    <button
                      onClick={handleCancelCrop}
                      className="px-4 py-2 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition-colors text-sm font-medium flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Cancel
                    </button>
                  </>
                )}
              </>
            )}
          </div>
          
          {/* Canvas Container */}
          <div
            ref={containerRef}
            onWheel={handleWheel}
            onMouseDown={handleDragStart}
            onMouseMove={handleDragMove}
            onMouseUp={handleDragEnd}
            onMouseLeave={handleDragEnd}
            className={`flex-1 w-full overflow-hidden rounded-lg ${image ? (selectedTool === 'crop' ? 'cursor-crosshair' : (isDraggingRef.current ? 'cursor-grabbing' : 'cursor-grab')) : ''}`}
            style={{
              backgroundImage: 'radial-gradient(circle, #374151 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          >
            <div className="min-h-full flex items-center justify-center p-8 relative">
              <div className="shadow-2xl rounded-lg overflow-visible relative" style={{
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
                
                {/* Crop Overlay */}
                {selectedTool === 'crop' && cropArea && canvasRef.current && (
                  <div
                    className="absolute"
                    style={{
                      left: 0,
                      top: 0,
                      width: `${canvasRef.current.width}px`,
                      height: `${canvasRef.current.height}px`,
                      pointerEvents: 'none',
                    }}
                  >
                    {/* Semi-transparent overlay over non-cropped area */}
                    <svg 
                      width={canvasRef.current.width} 
                      height={canvasRef.current.height}
                      className="absolute inset-0"
                      style={{ pointerEvents: 'none' }}
                    >
                      <defs>
                        <mask id="cropMask">
                          <rect width="100%" height="100%" fill="white" />
                          <rect 
                            x={cropArea.x} 
                            y={cropArea.y} 
                            width={cropArea.width} 
                            height={cropArea.height} 
                            fill="black" 
                          />
                        </mask>
                      </defs>
                      <rect 
                        width="100%" 
                        height="100%" 
                        fill="rgba(0, 0, 0, 0.5)" 
                        mask="url(#cropMask)" 
                      />
                    </svg>
                    
                    {/* Crop area border */}
                    <div
                      className="absolute border-2 border-white"
                      style={{
                        left: `${cropArea.x}px`,
                        top: `${cropArea.y}px`,
                        width: `${cropArea.width}px`,
                        height: `${cropArea.height}px`,
                        pointerEvents: 'none',
                      }}
                    >
                      {/* Resize handles */}
                      {['nw', 'ne', 'sw', 'se'].map((handle) => {
                        const isNorth = handle.includes('n');
                        const isWest = handle.includes('w');
                        return (
                          <div
                            key={handle}
                            className="absolute w-3 h-3 bg-white border-2 border-[#8b3dff] rounded-full"
                            style={{
                              top: isNorth ? '-6px' : 'auto',
                              bottom: !isNorth ? '-6px' : 'auto',
                              left: isWest ? '-6px' : 'auto',
                              right: !isWest ? '-6px' : 'auto',
                              pointerEvents: 'none',
                            }}
                          />
                        );
                      })}
                      
                      {/* Rule of thirds grid */}
                      <svg width="100%" height="100%" className="absolute inset-0" style={{ pointerEvents: 'none' }}>
                        <line x1="33.33%" y1="0" x2="33.33%" y2="100%" stroke="white" strokeWidth="1" opacity="0.5" />
                        <line x1="66.66%" y1="0" x2="66.66%" y2="100%" stroke="white" strokeWidth="1" opacity="0.5" />
                        <line x1="0" y1="33.33%" x2="100%" y2="33.33%" stroke="white" strokeWidth="1" opacity="0.5" />
                        <line x1="0" y1="66.66%" x2="100%" y2="66.66%" stroke="white" strokeWidth="1" opacity="0.5" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ImageCanvas;
