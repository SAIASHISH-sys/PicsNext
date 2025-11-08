import { useState, useRef, type SyntheticEvent } from 'react';
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  type Crop,
  type PixelCrop,
} from 'react-image-crop';
import { useImageCrop } from '../../hooks/useImageCrop';
import 'react-image-crop/dist/ReactCrop.css';
import './CropTool.css';

// Helper function to center the crop
function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number
): Crop {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

interface CropToolProps {
  isActive: boolean;
  aspectRatio?: number;
  onClose?: () => void;
}

export const CropTool = ({ isActive, aspectRatio, onClose }: CropToolProps) => {
  const { currentImage, applyCurrentCrop, cancelCrop } = useImageCrop();
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();

  const onImageLoad = (e: SyntheticEvent<HTMLImageElement>) => {
    const { width, height } = e.currentTarget;
    if (aspectRatio) {
      setCrop(centerAspectCrop(width, height, aspectRatio));
    } else {
      // Freeform crop
      setCrop({
        unit: '%',
        x: 5,
        y: 5,
        width: 90,
        height: 90,
      });
    }
  };

  const handleApplyCrop = () => {
    if (imgRef.current && completedCrop) {
      applyCurrentCrop(imgRef.current, completedCrop);
      onClose?.();
    }
  };

  const handleCancel = () => {
    cancelCrop();
    setCrop(undefined);
    setCompletedCrop(undefined);
    onClose?.();
  };

  if (!isActive || !currentImage) {
    return null;
  }

  return (
    <div className="crop-tool-overlay">
      <div className="crop-tool-container">
        <div className="crop-tool-header">
          <h3>Crop Image</h3>
          <div className="crop-tool-actions">
            <button onClick={handleCancel} className="btn-cancel">
              Cancel
            </button>
            <button
              onClick={handleApplyCrop}
              className="btn-apply"
              disabled={!completedCrop}
            >
              Apply Crop
            </button>
          </div>
        </div>
        <div className="crop-tool-content">
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={aspectRatio}
            className="crop-area"
          >
            <img
              ref={imgRef}
              src={currentImage}
              alt="Crop preview"
              onLoad={onImageLoad}
              style={{ maxHeight: '70vh', maxWidth: '100%' }}
            />
          </ReactCrop>
        </div>
      </div>
    </div>
  );
};