import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setBrightness, setContrast, setSaturation, setFilter, setRotation, setCropRatio } from '../store/imageEditorSlice';

interface PropertyPanelProps {
  selectedTool: string;
  brightness: number;
  contrast: number;
  saturation: number;
}

const PropertyPanel = ({
  selectedTool,
  brightness,
  contrast,
  saturation,
}: PropertyPanelProps) => {
  const dispatch = useAppDispatch();
  const currentCropRatio = useAppSelector((state) => state.imageEditor.present.cropRatio);

  const handleBrightnessChange = (value: number) => {
    dispatch(setBrightness(value));
  };

  const handleContrastChange = (value: number) => {
    dispatch(setContrast(value));
  };

  const handleSaturationChange = (value: number) => {
    dispatch(setSaturation(value));
  };

  const handleFilterChange = (filterName: string) => {
    dispatch(setFilter(filterName));
  };

  const handleRotation = (degrees: number) => {
    dispatch(setRotation(degrees));
  };

  const handleCropRatioChange = (ratio: string) => {
    dispatch(setCropRatio(ratio));
  };

  const renderToolProperties = () => {
    switch (selectedTool) {
      case 'brightness':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Brightness
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="range"
                  min="-100"
                  max="100"
                  value={brightness}
                  onChange={(e) => handleBrightnessChange(Number(e.target.value))}
                  className="flex-1 h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#8b3dff]"
                />
                <span className="text-white font-mono text-sm w-12 text-right">{brightness}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>-100</span>
                <span>0</span>
                <span>+100</span>
              </div>
            </div>
          </div>
        );

      case 'contrast':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Contrast
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="range"
                  min="-100"
                  max="100"
                  value={contrast}
                  onChange={(e) => handleContrastChange(Number(e.target.value))}
                  className="flex-1 h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#8b3dff]"
                />
                <span className="text-white font-mono text-sm w-12 text-right">{contrast}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>-100</span>
                <span>0</span>
                <span>+100</span>
              </div>
            </div>
          </div>
        );

      case 'saturation':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Saturation
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={saturation}
                  onChange={(e) => handleSaturationChange(Number(e.target.value))}
                  className="flex-1 h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#8b3dff]"
                />
                <span className="text-white font-mono text-sm w-12 text-right">{saturation}%</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>0%</span>
                <span>100%</span>
                <span>200%</span>
              </div>
            </div>
          </div>
        );

      case 'filters':
        return (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-300">Preset Filters</h3>
            <div className="grid grid-cols-2 gap-2">
              {['Grayscale', 'Sepia', 'Vintage', 'Cool', 'Warm', 'HDR'].map((filter) => (
                <button
                  key={filter}
                  className="px-3 py-2.5 bg-gray-800 text-gray-300 rounded-lg hover:bg-[#8b3dff] hover:text-white transition-colors text-sm font-medium"
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        );

      case 'rotate':
        return (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-300">Rotation</h3>
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => handleRotation(90)}
                className="px-3 py-2.5 bg-gray-800 text-gray-300 rounded-lg hover:bg-[#8b3dff] hover:text-white transition-colors text-sm font-medium"
              >
                90° CW
              </button>
              <button 
                onClick={() => handleRotation(270)}
                className="px-3 py-2.5 bg-gray-800 text-gray-300 rounded-lg hover:bg-[#8b3dff] hover:text-white transition-colors text-sm font-medium"
              >
                90° CCW
              </button>
              <button 
                onClick={() => handleRotation(180)}
                className="px-3 py-2.5 bg-gray-800 text-gray-300 rounded-lg hover:bg-[#8b3dff] hover:text-white transition-colors text-sm font-medium"
              >
                180°
              </button>
              <button 
                onClick={() => handleRotation(0)}
                className="px-3 py-2.5 bg-gray-800 text-gray-300 rounded-lg hover:bg-[#8b3dff] hover:text-white transition-colors text-sm font-medium"
              >
                Reset
              </button>
            </div>
          </div>
        );

      case 'crop':
        return (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-300">Crop Aspect Ratio</h3>
            <div className="space-y-2">
              {[
                { value: 'free', label: 'Free' },
                { value: '1:1', label: '1:1 (Square)' },
                { value: '4:3', label: '4:3' },
                { value: '16:9', label: '16:9 (Widescreen)' },
                { value: '3:2', label: '3:2' },
              ].map((ratio) => (
                <button
                  key={ratio.value}
                  onClick={() => handleCropRatioChange(ratio.value)}
                  className={`w-full px-3 py-2.5 rounded-lg transition-colors text-sm font-medium text-left ${
                    currentCropRatio === ratio.value
                      ? 'bg-[#8b3dff] text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-[#8b3dff] hover:text-white'
                  }`}
                >
                  {ratio.label}
                </button>
              ))}
            </div>
            <div className="pt-4 border-t border-gray-700">
              <p className="text-xs text-gray-400 mb-3">
                Select a ratio above, then drag on the image to create a crop area. Use the handles to resize.
              </p>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Brightness
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="range"
                  min="-100"
                  max="100"
                  value={brightness}
                  onChange={(e) => handleBrightnessChange(Number(e.target.value))}
                  className="flex-1 h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#8b3dff]"
                />
                <span className="text-white font-mono text-sm w-12 text-right">{brightness}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Contrast
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="range"
                  min="-100"
                  max="100"
                  value={contrast}
                  onChange={(e) => handleContrastChange(Number(e.target.value))}
                  className="flex-1 h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#8b3dff]"
                />
                <span className="text-white font-mono text-sm w-12 text-right">{contrast}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Saturation
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={saturation}
                  onChange={(e) => handleSaturationChange(Number(e.target.value))}
                  className="flex-1 h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#8b3dff]"
                />
                <span className="text-white font-mono text-sm w-12 text-right">{saturation}%</span>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-lg font-bold text-white mb-6">Edit</h2>
      <div className="space-y-6">
        {renderToolProperties()}
      </div>
    </div>
  );
};

export default PropertyPanel;
