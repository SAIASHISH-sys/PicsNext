import { useRef } from 'react';

interface UseImageFiltersProps {
  brightness: number;
  contrast: number;
  saturation: number;
}

export const useImageFilters = ({
  brightness,
  contrast,
  saturation,
}: UseImageFiltersProps) => {
  const prevFiltersRef = useRef({ brightness, contrast, saturation });

  const applyFilters = (
    ctx: CanvasRenderingContext2D,
    originalImageData: ImageData
  ) => {
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

  const resetFilterRef = () => {
    prevFiltersRef.current = { brightness, contrast, saturation };
  };

  return { applyFilters, resetFilterRef };
};
