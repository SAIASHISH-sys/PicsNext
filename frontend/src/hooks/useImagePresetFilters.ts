interface UseImagePresetFiltersProps {
  filter: string;
}

export const useImagePresetFilters = ({ filter }: UseImagePresetFiltersProps) => {
  const applyPresetFilter = (
    ctx: CanvasRenderingContext2D,
    imageData: ImageData
  ) => {
    if (filter === 'none') {
      ctx.putImageData(imageData, 0, 0);
      return;
    }

    const newImageData = ctx.createImageData(imageData);
    const data = newImageData.data;
    const originalData = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      let r = originalData[i];
      let g = originalData[i + 1];
      let b = originalData[i + 2];
      const a = originalData[i + 3];

      switch (filter.toLowerCase()) {
        case 'grayscale':
          // Standard grayscale conversion
          const gray = 0.299 * r + 0.587 * g + 0.114 * b;
          r = g = b = gray;
          break;

        case 'sepia':
          // Sepia tone formula
          const tr = 0.393 * r + 0.769 * g + 0.189 * b;
          const tg = 0.349 * r + 0.686 * g + 0.168 * b;
          const tb = 0.272 * r + 0.534 * g + 0.131 * b;
          r = Math.min(255, tr);
          g = Math.min(255, tg);
          b = Math.min(255, tb);
          break;

        case 'vintage':
          // Vintage: Sepia + reduced contrast + vignette effect
          const vr = 0.393 * r + 0.769 * g + 0.189 * b;
          const vg = 0.349 * r + 0.686 * g + 0.168 * b;
          const vb = 0.272 * r + 0.534 * g + 0.131 * b;
          // Reduce contrast slightly
          r = Math.min(255, vr * 0.9 + 20);
          g = Math.min(255, vg * 0.9 + 20);
          b = Math.min(255, vb * 0.9 + 10);
          break;

        case 'cool':
          // Cool tone: Boost blues, reduce reds
          r = r * 0.8;
          g = g * 0.95;
          b = Math.min(255, b * 1.2);
          break;

        case 'warm':
          // Warm tone: Boost reds/yellows, reduce blues
          r = Math.min(255, r * 1.15);
          g = Math.min(255, g * 1.05);
          b = b * 0.85;
          break;

        case 'hdr':
          // HDR effect: Increased local contrast and saturation
          // Calculate luminance
          const lum = 0.299 * r + 0.587 * g + 0.114 * b;
          
          // Increase saturation
          const saturationBoost = 1.3;
          r = lum + (r - lum) * saturationBoost;
          g = lum + (g - lum) * saturationBoost;
          b = lum + (b - lum) * saturationBoost;
          
          // Apply subtle S-curve for contrast
          r = appleSCurve(r);
          g = appleSCurve(g);
          b = appleSCurve(b);
          break;

        default:
          // No filter
          break;
      }

      // Clamp values
      data[i] = Math.max(0, Math.min(255, r));
      data[i + 1] = Math.max(0, Math.min(255, g));
      data[i + 2] = Math.max(0, Math.min(255, b));
      data[i + 3] = a;
    }

    ctx.putImageData(newImageData, 0, 0);
  };

  return { applyPresetFilter };
};

// Helper function for S-curve contrast enhancement
function appleSCurve(value: number): number {
  // Normalize to 0-1 range
  const x = value / 255;
  
  // Apply S-curve: f(x) = 3x^2 - 2x^3
  const curved = 3 * x * x - 2 * x * x * x;
  
  // Convert back to 0-255 range
  return curved * 255;
}
