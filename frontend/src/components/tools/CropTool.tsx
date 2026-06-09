import { useState, useRef } from 'react';
import './CropTool.css';

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface CropToolProps {
  imageUrl: string | null;
  isOpen: boolean;
  onCropComplete: (croppedImageUrl: string) => void;
  onCancel: () => void;
  aspectRatio?: number;
}

export const CropTool = ({
  imageUrl,
  isOpen,
  onCropComplete,
  onCancel,
  aspectRatio = 1,
}: CropToolProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [cropArea, setCropArea] = useState<CropArea>({ x: 0, y: 0, width: 100, height: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);
  const [imgDimensions, setImgDimensions] = useState<{ width: number; height: number } | null>(null);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const width = img.naturalWidth;
    const height = img.naturalHeight;
    setImgDimensions({ width, height });

    // Initialize crop area based on aspect ratio
    let cropWidth = Math.min(width, height);
    let cropHeight = cropWidth / aspectRatio;

    if (cropHeight > height) {
      cropHeight = height;
      cropWidth = cropHeight * aspectRatio;
    }

    const startX = (width - cropWidth) / 2;
    const startY = (height - cropHeight) / 2;
    setCropArea({ x: startX, y: startY, width: cropWidth, height: cropHeight });
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !imgRef.current) return;
    setIsDragging(true);
    const rect = containerRef.current.getBoundingClientRect();
    setDragStart({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !dragStart || !containerRef.current || !imgDimensions) return;

    const rect = containerRef.current.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    const scale = containerRef.current.offsetWidth / imgDimensions.width;
    const deltaX = (currentX - dragStart.x) / scale;
    const deltaY = (currentY - dragStart.y) / scale;

    const newX = Math.max(0, Math.min(cropArea.x + deltaX, imgDimensions.width - cropArea.width));
    const newY = Math.max(0, Math.min(cropArea.y + deltaY, imgDimensions.height - cropArea.height));

    setCropArea((prev) => ({
      ...prev,
      x: newX,
      y: newY,
    }));

    setDragStart({
      x: currentX,
      y: currentY,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragStart(null);
  };

  const handleApplyCrop = () => {
    if (!imgRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    canvas.width = cropArea.width;
    canvas.height = cropArea.height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(
      imgRef.current,
      cropArea.x,
      cropArea.y,
      cropArea.width,
      cropArea.height,
      0,
      0,
      cropArea.width,
      cropArea.height
    );

    const croppedImageUrl = canvas.toDataURL('image/png');
    onCropComplete(croppedImageUrl);
  };

  if (!isOpen || !imageUrl) {
    return null;
  }

  return (
    <div className="crop-tool-overlay">
      <div className="crop-tool-container">
        <div className="crop-tool-header">
          <h3>Crop Image</h3>
          <div className="crop-tool-actions">
            <button onClick={onCancel} className="btn-cancel">
              Cancel
            </button>
            <button onClick={handleApplyCrop} className="btn-apply">
              Apply Crop
            </button>
          </div>
        </div>
        <div className="crop-tool-content">
          <div
            ref={containerRef}
            className="crop-preview-container"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <img
              ref={imgRef}
              src={imageUrl}
              alt="Crop preview"
              onLoad={handleImageLoad}
              style={{ maxHeight: '70vh', maxWidth: '100%', display: 'block' }}
            />
            {imgDimensions && (
              <div
                className="crop-selection-box"
                style={{
                  left: `${(cropArea.x / imgDimensions.width) * 100}%`,
                  top: `${(cropArea.y / imgDimensions.height) * 100}%`,
                  width: `${(cropArea.width / imgDimensions.width) * 100}%`,
                  height: `${(cropArea.height / imgDimensions.height) * 100}%`,
                }}
              />
            )}
          </div>
        </div>
      </div>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
    </div>
  );
};