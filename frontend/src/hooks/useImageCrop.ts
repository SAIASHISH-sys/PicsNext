import { useState, useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setCropArea, applyCrop, type CropArea } from '../store/imageEditorSlice';

interface UseImageCropProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  containerRef: React.RefObject<HTMLDivElement | null>;
  isActive: boolean;
  zoom?: number;
  panOffset?: { x: number; y: number };
}

export const useImageCrop = ({ 
  canvasRef, 
  containerRef, 
  isActive,
  zoom = 1,
  panOffset = { x: 0, y: 0 }
}: UseImageCropProps) => {
  const dispatch = useAppDispatch();
  const cropRatio = useAppSelector((state) => state.imageEditor.present.cropRatio);
  const storedCropArea = useAppSelector((state) => state.imageEditor.present.cropArea);
  
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const [cropStart, setCropStart] = useState<{ x: number; y: number } | null>(null);
  const [localCropArea, setLocalCropArea] = useState<CropArea | null>(storedCropArea);

  // Sync local crop area with Redux store
  useEffect(() => {
    setLocalCropArea(storedCropArea);
  }, [storedCropArea]);

  const getCanvasCoordinates = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return null;

    const rect = canvas.getBoundingClientRect();
    
    // The canvas has transform: translate(panOffset.x, panOffset.y) scale(zoom)
    // getBoundingClientRect gives us the position AFTER transforms
    // So we need to subtract the client position from rect, then divide by zoom
    const x = (clientX - rect.left) / zoom;
    const y = (clientY - rect.top) / zoom;

    // Ensure coordinates are within canvas bounds
    return {
      x: Math.max(0, Math.min(x, canvas.width)),
      y: Math.max(0, Math.min(y, canvas.height)),
    };
  }, [canvasRef, containerRef, zoom]);

  const calculateCropDimensions = useCallback((start: { x: number; y: number }, end: { x: number; y: number }) => {
    let width = Math.abs(end.x - start.x);
    let height = Math.abs(end.y - start.y);
    const x = Math.min(start.x, end.x);
    const y = Math.min(start.y, end.y);

    // Apply aspect ratio if needed
    if (cropRatio !== 'free') {
      const [ratioW, ratioH] = cropRatio.split(':').map(Number);
      const aspectRatio = ratioW / ratioH;
      
      // Calculate which dimension to constrain based on which is larger
      const currentAspect = width / height;
      
      if (currentAspect > aspectRatio) {
        // Width is too large, constrain it
        width = height * aspectRatio;
      } else {
        // Height is too large, constrain it
        height = width / aspectRatio;
      }
    }

    return { x, y, width, height };
  }, [cropRatio]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!isActive) return;
    
    const coords = getCanvasCoordinates(e.clientX, e.clientY);
    if (!coords) return;

    // Check if clicking on resize handles ONLY if there's a valid crop area with decent size
    if (localCropArea && localCropArea.width > 20 && localCropArea.height > 20) {
      const handle = getResizeHandle(coords, localCropArea);
      if (handle) {
        setIsResizing(true);
        setResizeHandle(handle);
        setCropStart(coords);
        return;
      }

      // Check if clicking inside crop area to move it
      if (isInsideCropArea(coords, localCropArea)) {
        setIsDragging(true);
        setCropStart(coords);
        return;
      }
    }

    // Start new crop area (clicking outside existing crop or no crop exists)
    setIsDragging(true);
    setCropStart(coords);
    setLocalCropArea(null);
  }, [isActive, localCropArea, getCanvasCoordinates]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isActive || !cropStart) return;

    const coords = getCanvasCoordinates(e.clientX, e.clientY);
    if (!coords) return;

    if (isResizing && localCropArea && resizeHandle) {
      // Handle resizing
      const newCropArea = handleResize(localCropArea, coords, cropStart, resizeHandle);
      setLocalCropArea(newCropArea);
    } else if (isDragging && localCropArea) {
      // Handle moving
      const dx = coords.x - cropStart.x;
      const dy = coords.y - cropStart.y;
      const canvas = canvasRef.current;
      if (!canvas) return;

      const newCropArea = {
        ...localCropArea,
        x: Math.max(0, Math.min(localCropArea.x + dx, canvas.width - localCropArea.width)),
        y: Math.max(0, Math.min(localCropArea.y + dy, canvas.height - localCropArea.height)),
      };
      setLocalCropArea(newCropArea);
      setCropStart(coords);
    } else if (isDragging) {
      // Handle creating new crop area
      const newCropArea = calculateCropDimensions(cropStart, coords);
      setLocalCropArea(newCropArea);
    }
  }, [isActive, isDragging, isResizing, cropStart, localCropArea, resizeHandle, getCanvasCoordinates, calculateCropDimensions, canvasRef]);

  const handleMouseUp = useCallback(() => {
    if (localCropArea && (isDragging || isResizing)) {
      // Save to Redux when mouse is released
      dispatch(setCropArea(localCropArea));
    }
    setIsDragging(false);
    setIsResizing(false);
    setResizeHandle(null);
    setCropStart(null);
  }, [localCropArea, isDragging, isResizing, dispatch]);

  const handleApplyCrop = useCallback(() => {
    if (!localCropArea) return null;

    const canvas = canvasRef.current;
    if (!canvas) return null;

    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Get the current canvas image data
    const imageData = ctx.getImageData(
      localCropArea.x,
      localCropArea.y,
      localCropArea.width,
      localCropArea.height
    );

    // Create new canvas with cropped dimensions
    const croppedCanvas = document.createElement('canvas');
    croppedCanvas.width = localCropArea.width;
    croppedCanvas.height = localCropArea.height;
    const croppedCtx = croppedCanvas.getContext('2d');
    
    if (croppedCtx) {
      croppedCtx.putImageData(imageData, 0, 0);
      dispatch(applyCrop());
      return croppedCanvas;
    }

    return null;
  }, [localCropArea, canvasRef, dispatch]);

  const handleCancelCrop = useCallback(() => {
    setLocalCropArea(null);
    dispatch(setCropArea(null));
  }, [dispatch]);

  return {
    cropArea: localCropArea,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleApplyCrop,
    handleCancelCrop,
    isDragging: isDragging || isResizing,
  };
};

// Helper functions
function isInsideCropArea(point: { x: number; y: number }, area: CropArea): boolean {
  return (
    point.x >= area.x &&
    point.x <= area.x + area.width &&
    point.y >= area.y &&
    point.y <= area.y + area.height
  );
}

function getResizeHandle(point: { x: number; y: number }, area: CropArea): string | null {
  const handleSize = 15; // Increased from 8 for better grab area
  const corners = {
    nw: { x: area.x, y: area.y },
    ne: { x: area.x + area.width, y: area.y },
    sw: { x: area.x, y: area.y + area.height },
    se: { x: area.x + area.width, y: area.y + area.height },
  };

  for (const [handle, corner] of Object.entries(corners)) {
    if (
      Math.abs(point.x - corner.x) <= handleSize &&
      Math.abs(point.y - corner.y) <= handleSize
    ) {
      return handle;
    }
  }

  return null;
}

function handleResize(
  area: CropArea,
  current: { x: number; y: number },
  start: { x: number; y: number },
  handle: string
): CropArea {
  const dx = current.x - start.x;
  const dy = current.y - start.y;

  switch (handle) {
    case 'nw':
      return {
        x: area.x + dx,
        y: area.y + dy,
        width: Math.max(10, area.width - dx),
        height: Math.max(10, area.height - dy),
      };
    case 'ne':
      return {
        x: area.x,
        y: area.y + dy,
        width: Math.max(10, area.width + dx),
        height: Math.max(10, area.height - dy),
      };
    case 'sw':
      return {
        x: area.x + dx,
        y: area.y,
        width: Math.max(10, area.width - dx),
        height: Math.max(10, area.height + dy),
      };
    case 'se':
      return {
        x: area.x,
        y: area.y,
        width: Math.max(10, area.width + dx),
        height: Math.max(10, area.height + dy),
      };
    default:
      return area;
  }
}
