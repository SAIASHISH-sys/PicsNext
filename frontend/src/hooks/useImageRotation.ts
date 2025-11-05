import { useEffect, useRef } from 'react';
import { useAppSelector } from '../store/hooks';

interface UseImageRotationProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  image: HTMLImageElement | null;
  originalImageData: ImageData | null;
  brightness: number;
  contrast: number;
  saturation: number;
}

/**
 * Custom hook to apply rotation to the canvas image
 */
export const useImageRotation = ({ 
  canvasRef, 
  image, 
  originalImageData,
  brightness,
  contrast,
  saturation
}: UseImageRotationProps) => {
  // Get rotation from Redux
  const rotation = useAppSelector((state) => state.imageEditor.present.rotation);
  
  const rotatedImageDataRef = useRef<ImageData | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !image || !originalImageData) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Determine canvas dimensions based on rotation
    const isSideways = rotation === 90 || rotation === 270;
    const canvasWidth = isSideways ? image.height : image.width;
    const canvasHeight = isSideways ? image.width : image.height;

    // Only resize canvas if rotation changed the orientation
    if (canvas.width !== canvasWidth || canvas.height !== canvasHeight) {
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
    }

    // Clear canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Save context state
    ctx.save();

    // Move origin to center
    ctx.translate(canvasWidth / 2, canvasHeight / 2);

    // Apply rotation
    const angleInRadians = (rotation * Math.PI) / 180;
    ctx.rotate(angleInRadians);

    // Draw image centered
    ctx.drawImage(
      image,
      -image.width / 2,
      -image.height / 2,
      image.width,
      image.height
    );

    // Restore context
    ctx.restore();

    // Get the rotated image data for filter application
    const rotatedData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
    rotatedImageDataRef.current = rotatedData;

  }, [canvasRef, image, originalImageData, rotation, brightness, contrast, saturation]);

  return { 
    rotatedImageData: rotatedImageDataRef.current,
    rotation 
  };
};