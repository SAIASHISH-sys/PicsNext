import { useRef, useEffect, useState } from 'react';

interface ImageCanvasProps {
  selectedTool: string;
  brightness: number;
  contrast: number;
  saturation: number;
  onHistoryChange: (action: string) => void;
}

const ImageCanvas = ({ 
  selectedTool, 
  brightness, 
  contrast, 
  saturation,
  onHistoryChange 
}: ImageCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [originalImageData, setOriginalImageData] = useState<ImageData | null>(null);

  useEffect(() => {
    if (image && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Draw original image
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

      // Save original image data on first load
      if (!originalImageData) {
        setOriginalImageData(ctx.getImageData(0, 0, canvas.width, canvas.height));
      }

      // Apply filters
      applyFilters(ctx, canvas.width, canvas.height);
    }
  }, [image, brightness, contrast, saturation, originalImageData]);

  const applyFilters = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    if (!originalImageData) return;

    const imageData = ctx.createImageData(originalImageData);
    const data = imageData.data;
    const originalData = originalImageData.data;

    for (let i = 0; i < data.length; i += 4) {
      let r = originalData[i];
      let g = originalData[i + 1];
      let b = originalData[i + 2];

      // Apply brightness
      r += brightness;
      g += brightness;
      b += brightness;

      // Apply contrast
      const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
      r = factor * (r - 128) + 128;
      g = factor * (g - 128) + 128;
      b = factor * (b - 128) + 128;

      // Apply saturation
      const gray = 0.2989 * r + 0.5870 * g + 0.1140 * b;
      r = gray + saturation / 100 * (r - gray);
      g = gray + saturation / 100 * (g - gray);
      b = gray + saturation / 100 * (b - gray);

      // Clamp values
      data[i] = Math.max(0, Math.min(255, r));
      data[i + 1] = Math.max(0, Math.min(255, g));
      data[i + 2] = Math.max(0, Math.min(255, b));
      data[i + 3] = originalData[i + 3];
    }

    ctx.putImageData(imageData, 0, 0);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Set canvas size to image size
        canvas.width = img.width;
        canvas.height = img.height;

        setImage(img);
        setOriginalImageData(null); // Reset to trigger new original data capture
        onHistoryChange('Image uploaded');
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
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
      onHistoryChange('Image downloaded');
    });
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-gray-100 p-4 overflow-auto">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />
      
      {!image ? (
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="text-center">
            <svg
              className="mx-auto h-24 w-24 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No image loaded</h3>
            <p className="mt-1 text-sm text-gray-500">Upload an image to get started</p>
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md"
          >
            Upload Image
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-4 w-full">
          <div className="flex space-x-4">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Upload New
            </button>
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
            >
              Download
            </button>
          </div>
          <div className="border-4 border-gray-300 rounded-lg shadow-lg bg-white max-w-full max-h-[70vh] overflow-auto">
            <canvas
              ref={canvasRef}
              className="max-w-full h-auto"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageCanvas;
