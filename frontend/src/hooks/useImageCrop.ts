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
    getCroppedImage,
    getCroppedImageBlob,
  };
};
