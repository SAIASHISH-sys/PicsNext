interface UseImageBlurProps {
  blur: number;
}

export const useImageBlur = ({ blur }: UseImageBlurProps) => {
  const applyBlur = (
    ctx: CanvasRenderingContext2D,
    imageData: ImageData
  ) => {
    if (blur === 0) {
      ctx.putImageData(imageData, 0, 0);
      return;
    }

    // Use canvas built-in filter for blur
    ctx.filter = `blur(${blur / 10}px)`;
    ctx.putImageData(imageData, 0, 0);
    
    // Draw the blurred image
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = imageData.width;
    tempCanvas.height = imageData.height;
    const tempCtx = tempCanvas.getContext('2d');
    
    if (tempCtx) {
      tempCtx.putImageData(imageData, 0, 0);
      
      ctx.clearRect(0, 0, imageData.width, imageData.height);
      ctx.filter = `blur(${blur / 10}px)`;
      ctx.drawImage(tempCanvas, 0, 0);
      ctx.filter = 'none';
    }
  };

  return { applyBlur };
};