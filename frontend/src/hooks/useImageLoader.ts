import { useState, useCallback, useRef } from 'react';

interface UseImageLoaderReturn {
  image: HTMLImageElement | null;
  imageUrl: string | null;
  originalImageData: ImageData | null;
  isLoading: boolean;
  error: string | null;
  loadImage: (file: File) => Promise<void>;
  loadImageFromUrl: (url: string) => Promise<void>;
  clearImage: () => void;
  setOriginalImageData: (data: ImageData | null) => void;
}

/**
 * Custom hook for loading and managing images in the photo editor
 * 
 * @returns Object containing image state and loading functions
 * 
 * @example
 * const { image, loadImage, clearImage } = useImageLoader();
 * 
 * // Load from file
 * await loadImage(fileFromInput);
 * 
 * // Load from URL
 * await loadImageFromUrl('https://example.com/image.jpg');
 */
export const useImageLoader = (): UseImageLoaderReturn => {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [originalImageData, setOriginalImageData] = useState<ImageData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Keep track of previous URL to revoke it
  const previousUrlRef = useRef<string | null>(null);

  /**
   * Load an image from a File object
   */
  const loadImage = useCallback(async (file: File): Promise<void> => {
    if (!file) {
      setError('No file provided');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('File is not an image');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Revoke previous URL to prevent memory leaks
      if (previousUrlRef.current) {
        URL.revokeObjectURL(previousUrlRef.current);
      }

      // Create object URL from file
      const url = URL.createObjectURL(file);
      previousUrlRef.current = url;
      setImageUrl(url);

      // Load image
      await loadImageFromUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load image');
      setIsLoading(false);
    }
  }, []);

  /**
   * Load an image from a URL
   */
  const loadImageFromUrl = useCallback(async (url: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    return new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        setImage(img);
        setImageUrl(url);
        setIsLoading(false);
        setOriginalImageData(null); // Reset to trigger new original data capture
        resolve();
      };

      img.onerror = () => {
        const errorMsg = 'Failed to load image from URL';
        setError(errorMsg);
        setIsLoading(false);
        reject(new Error(errorMsg));
      };

      // Handle CORS for external images
      img.crossOrigin = 'anonymous';
      img.src = url;
    });
  }, []);

  /**
   * Clear the current image and reset state
   */
  const clearImage = useCallback(() => {
    // Revoke object URL to prevent memory leaks
    if (previousUrlRef.current) {
      URL.revokeObjectURL(previousUrlRef.current);
      previousUrlRef.current = null;
    }

    setImage(null);
    setImageUrl(null);
    setOriginalImageData(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    image,
    imageUrl,
    originalImageData,
    isLoading,
    error,
    loadImage,
    loadImageFromUrl,
    clearImage,
    setOriginalImageData,
  };
};

export default useImageLoader;
