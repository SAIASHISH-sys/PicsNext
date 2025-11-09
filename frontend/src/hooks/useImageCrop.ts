import { useState, useRef, useCallback } from 'react';
import { useAppSelector } from '../store/hooks';

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface UseImageCropProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  containerRef: React.RefObject<HTMLDivElement | null>;
  isActive: boolean;
  zoom: number;
  panOffset: { x: number; y: number };
}

export const useImageCrop = ({
  canvasRef,
  containerRef,
  isActive,
  zoom,
}: UseImageCropProps) => {
  const [cropArea, setCropArea] = useState<CropArea | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const initialCropRef = useRef<CropArea | null>(null);

  const cropRatio = useAppSelector((state) => state.imageEditor.present.cropRatio);

  const getCanvasCoordinates = useCallback(
    (clientX: number, clientY: number): { x: number; y: number } | null => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return null;

      const rect = canvas.getBoundingClientRect();
      const x = (clientX - rect.left) / zoom;
      const y = (clientY - rect.top) / zoom;

      return { x, y };
    },
    [canvasRef, containerRef, zoom]
  );

  const calculateCropDimensions = useCallback(
    (start: { x: number; y: number }, end: { x: number; y: number }): CropArea => {
      let width = Math.abs(end.x - start.x);
      let height = Math.abs(end.y - start.y);
      const x = Math.min(start.x, end.x);
      const y = Math.min(start.y, end.y);

      if (cropRatio !== 'free') {
        const [ratioW, ratioH] = cropRatio.split(':').map(Number);
        const targetRatio = ratioW / ratioH;
        const currentRatio = width / height;

        if (currentRatio > targetRatio) {
          width = height * targetRatio;
        } else {
          height = width / targetRatio;
        }
      }

      return { x, y, width, height };
    },
    [cropRatio]
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!isActive) return;

      const coords = getCanvasCoordinates(e.clientX, e.clientY);
      if (!coords) return;

      if (cropArea) {
        const handle = getResizeHandle(coords, cropArea);
        if (handle && cropArea.width > 20 && cropArea.height > 20) {
          setIsResizing(true);
          setResizeHandle(handle);
          setDragStart(coords);
          initialCropRef.current = { ...cropArea };
          return;
        }

        if (isInsideCropArea(coords, cropArea) && cropArea.width > 20 && cropArea.height > 20) {
          setIsDragging(true);
          setDragStart(coords);
          initialCropRef.current = { ...cropArea };
          return;
        }
      }

      setDragStart(coords);
      setCropArea({ x: coords.x, y: coords.y, width: 0, height: 0 });
    },
    [isActive, cropArea, getCanvasCoordinates]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isActive || !dragStart) return;

      const coords = getCanvasCoordinates(e.clientX, e.clientY);
      if (!coords || !canvasRef.current) return;

      if (isResizing && resizeHandle && initialCropRef.current) {
        const newCrop = handleResize(
          initialCropRef.current,
          coords,
          dragStart,
          resizeHandle
        );
        setCropArea(newCrop);
      } else if (isDragging && initialCropRef.current) {
        const dx = coords.x - dragStart.x;
        const dy = coords.y - dragStart.y;
        const newCrop = {
          x: Math.max(0, Math.min(initialCropRef.current.x + dx, canvasRef.current.width - initialCropRef.current.width)),
          y: Math.max(0, Math.min(initialCropRef.current.y + dy, canvasRef.current.height - initialCropRef.current.height)),
          width: initialCropRef.current.width,
          height: initialCropRef.current.height,
        };
        setCropArea(newCrop);
      } else {
        const newCrop = calculateCropDimensions(dragStart, coords);
        setCropArea(newCrop);
      }
    },
    [isActive, dragStart, isDragging, isResizing, resizeHandle, getCanvasCoordinates, calculateCropDimensions, canvasRef]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
    setDragStart(null);
    setResizeHandle(null);
    initialCropRef.current = null;
  }, []);

  const handleApplyCrop = useCallback((): HTMLCanvasElement | null => {
    if (!cropArea || !canvasRef.current) return null;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const croppedCanvas = document.createElement('canvas');
    croppedCanvas.width = Math.floor(cropArea.width);
    croppedCanvas.height = Math.floor(cropArea.height);
    const croppedCtx = croppedCanvas.getContext('2d');

    if (!croppedCtx) return null;

    const imageData = ctx.getImageData(
      Math.floor(cropArea.x),
      Math.floor(cropArea.y),
      Math.floor(cropArea.width),
      Math.floor(cropArea.height)
    );

    croppedCtx.putImageData(imageData, 0, 0);
    setCropArea(null);

    return croppedCanvas;
  }, [cropArea, canvasRef]);

  const handleCancelCrop = useCallback(() => {
    setCropArea(null);
    setIsDragging(false);
    setIsResizing(false);
    setDragStart(null);
    setResizeHandle(null);
    initialCropRef.current = null;
  }, []);

  return {
    cropArea,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleApplyCrop,
    handleCancelCrop,
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
  const handleSize = 15;
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
