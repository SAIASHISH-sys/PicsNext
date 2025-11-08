/**
 * Example Component showing how to use the CropTool
 * This demonstrates integration similar to the reference code
 */

import { useState } from 'react';
import { CropTool } from './tools/CropTool';

export const CropToolExample = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string>('');
  const [isCropDialogOpen, setIsCropDialogOpen] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<number>(1); // Default 1:1 square

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const imageUrl = reader.result as string;
      setSelectedImage(imageUrl);
      setIsCropDialogOpen(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = (croppedImageUrl: string) => {
    setCroppedImage(croppedImageUrl);
    setIsCropDialogOpen(false);
  };

  const handleCropCancel = () => {
    setIsCropDialogOpen(false);
  };

  const handleOpenCrop = () => {
    if (selectedImage) {
      setIsCropDialogOpen(true);
    }
  };

  const handleClearImage = () => {
    setSelectedImage(null);
    setCroppedImage('');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Image Crop Tool</h2>

      {/* Upload Section */}
      <div className="mb-6">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
          id="image-upload"
        />
        <label
          htmlFor="image-upload"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-500 inline-block"
        >
          Upload Image
        </label>
      </div>

      {/* Aspect Ratio Selection */}
      {selectedImage && (
        <div className="mb-6 flex gap-4 flex-wrap">
          <button
            onClick={() => setAspectRatio(1)}
            className={`px-4 py-2 rounded ${
              aspectRatio === 1 ? 'bg-purple-600' : 'bg-gray-700'
            } text-white hover:bg-purple-500`}
          >
            Square (1:1)
          </button>
          <button
            onClick={() => setAspectRatio(16 / 9)}
            className={`px-4 py-2 rounded ${
              aspectRatio === 16 / 9 ? 'bg-purple-600' : 'bg-gray-700'
            } text-white hover:bg-purple-500`}
          >
            Widescreen (16:9)
          </button>
          <button
            onClick={() => setAspectRatio(4 / 3)}
            className={`px-4 py-2 rounded ${
              aspectRatio === 4 / 3 ? 'bg-purple-600' : 'bg-gray-700'
            } text-white hover:bg-purple-500`}
          >
            Classic (4:3)
          </button>
          <button
            onClick={() => setAspectRatio(3 / 4)}
            className={`px-4 py-2 rounded ${
              aspectRatio === 3 / 4 ? 'bg-purple-600' : 'bg-gray-700'
            } text-white hover:bg-purple-500`}
          >
            Portrait (3:4)
          </button>
        </div>
      )}

      {/* Image Display */}
      {(croppedImage || selectedImage) && (
        <div className="mb-6">
          <div className="relative inline-block">
            <img
              src={croppedImage || selectedImage || ''}
              alt="Preview"
              className="max-w-md rounded-lg shadow-lg border-4 border-purple-500 cursor-pointer"
              onClick={handleOpenCrop}
            />
            {!croppedImage && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                <span className="text-white text-sm font-medium">Click to crop</span>
              </div>
            )}
          </div>

          <div className="mt-4 flex gap-4">
            {croppedImage && (
              <button
                onClick={handleOpenCrop}
                className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
              >
                Re-crop
              </button>
            )}
            <button
              onClick={handleClearImage}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Crop Tool Dialog */}
      <CropTool
        imageUrl={selectedImage}
        isOpen={isCropDialogOpen}
        onCropComplete={handleCropComplete}
        onCancel={handleCropCancel}
        aspectRatio={aspectRatio}
      />
    </div>
  );
};
