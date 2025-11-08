import { useCallback } from 'react';
import type { PixelCrop } from 'react-image-crop';

/**
 * Hook for handling image cropping using react-image-crop library
 * Based on the reference implementation from the provided example
 */
export const useImageCrop = () => {
  /**
   * Generates a cropped image from the source image and crop area
   * Similar to getCroppedImg function in the reference code
   * 
   * @param image - The source HTMLImageElement
   * @param crop - The PixelCrop object containing crop dimensions
   * @returns Data URL of the cropped image
   */
  const getCroppedImage = useCallback((image: HTMLImageElement, crop: PixelCrop): string => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = crop.width * scaleX;
    canvas.height = crop.height * scaleY;

    const ctx = canvas.getContext('2d');

    if (ctx) {
      // Enable high-quality image smoothing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width * scaleX,
        crop.height * scaleY
      );
    }

    return canvas.toDataURL('image/png', 1.0);
  }, []);

  /**
   * Converts a cropped image data URL to a Blob
   * Useful for uploading or further processing
   * 
   * @param croppedImageUrl - Data URL of the cropped image
   * @returns Promise that resolves to a Blob
   */
  const getCroppedImageBlob = useCallback(
    async (croppedImageUrl: string): Promise<Blob | null> => {
      return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx?.drawImage(img, 0, 0);
          canvas.toBlob((blob) => {
            resolve(blob);
          }, 'image/png', 1.0);
        };

        img.onerror = () => {
          resolve(null);
        };

        img.src = croppedImageUrl;
      });
    },
    []
  );

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
