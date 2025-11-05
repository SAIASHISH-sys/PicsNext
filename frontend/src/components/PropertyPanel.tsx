import { useAppDispatch } from '../store/hooks';
import { setBrightness, setContrast, setSaturation, setFilter } from '../store/imageEditorSlice';

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
              <button className="px-3 py-2.5 bg-gray-800 text-gray-300 rounded-lg hover:bg-[#8b3dff] hover:text-white transition-colors text-sm font-medium">
                90° CW
              </button>
              <button className="px-3 py-2.5 bg-gray-800 text-gray-300 rounded-lg hover:bg-[#8b3dff] hover:text-white transition-colors text-sm font-medium">
                90° CCW
              </button>
              <button className="px-3 py-2.5 bg-gray-800 text-gray-300 rounded-lg hover:bg-[#8b3dff] hover:text-white transition-colors text-sm font-medium">
                180°
              </button>
              <button className="px-3 py-2.5 bg-gray-800 text-gray-300 rounded-lg hover:bg-[#8b3dff] hover:text-white transition-colors text-sm font-medium">
                Custom
              </button>
            </div>
          </div>
        );

      case 'crop':
        return (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-300">Crop Aspect Ratio</h3>
            <div className="space-y-2">
              {['Free', '1:1', '4:3', '16:9', '3:2'].map((ratio) => (
                <button
                  key={ratio}
                  className="w-full px-3 py-2.5 bg-gray-800 text-gray-300 rounded-lg hover:bg-[#8b3dff] hover:text-white transition-colors text-sm font-medium text-left"
                >
                  {ratio}
                </button>
              ))}
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
