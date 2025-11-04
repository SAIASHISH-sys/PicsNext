interface PropertyPanelProps {
  selectedTool: string;
  brightness: number;
  contrast: number;
  saturation: number;
  onBrightnessChange: (value: number) => void;
  onContrastChange: (value: number) => void;
  onSaturationChange: (value: number) => void;
}

const PropertyPanel = ({
  selectedTool,
  brightness,
  contrast,
  saturation,
  onBrightnessChange,
  onContrastChange,
  onSaturationChange,
}: PropertyPanelProps) => {
  const renderToolProperties = () => {
    switch (selectedTool) {
      case 'brightness':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brightness: {brightness}
              </label>
              <input
                type="range"
                min="-100"
                max="100"
                value={brightness}
                onChange={(e) => onBrightnessChange(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contrast: {contrast}
              </label>
              <input
                type="range"
                min="-100"
                max="100"
                value={contrast}
                onChange={(e) => onContrastChange(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Saturation: {saturation}%
              </label>
              <input
                type="range"
                min="0"
                max="200"
                value={saturation}
                onChange={(e) => onSaturationChange(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0%</span>
                <span>100%</span>
                <span>200%</span>
              </div>
            </div>
          </div>
        );

      case 'filters':
        return (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700">Preset Filters</h3>
            <div className="grid grid-cols-2 gap-2">
              {['Grayscale', 'Sepia', 'Vintage', 'Cool', 'Warm', 'HDR'].map((filter) => (
                <button
                  key={filter}
                  className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-blue-100 hover:text-blue-700 transition-colors text-sm font-medium"
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
        );

      case 'rotate':
        return (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-700">Rotation</h3>
            <div className="grid grid-cols-2 gap-2">
              <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-blue-100 hover:text-blue-700 transition-colors text-sm font-medium">
                90° CW
              </button>
              <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-blue-100 hover:text-blue-700 transition-colors text-sm font-medium">
                90° CCW
              </button>
              <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-blue-100 hover:text-blue-700 transition-colors text-sm font-medium">
                180°
              </button>
              <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-blue-100 hover:text-blue-700 transition-colors text-sm font-medium">
                Custom
              </button>
            </div>
          </div>
        );

      case 'crop':
        return (
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-700">Crop Aspect Ratio</h3>
            <div className="space-y-2">
              {['Free', '1:1', '4:3', '16:9', '3:2'].map((ratio) => (
                <button
                  key={ratio}
                  className="w-full px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-blue-100 hover:text-blue-700 transition-colors text-sm font-medium text-left"
                >
                  {ratio}
                </button>
              ))}
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brightness: {brightness}
              </label>
              <input
                type="range"
                min="-100"
                max="100"
                value={brightness}
                onChange={(e) => onBrightnessChange(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contrast: {contrast}
              </label>
              <input
                type="range"
                min="-100"
                max="100"
                value={contrast}
                onChange={(e) => onContrastChange(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Saturation: {saturation}%
              </label>
              <input
                type="range"
                min="0"
                max="200"
                value={saturation}
                onChange={(e) => onSaturationChange(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="bg-white border-l border-gray-300 p-4 overflow-y-auto">
      <h2 className="text-lg font-bold text-gray-800 mb-4">Properties</h2>
      <div className="space-y-6">
        {renderToolProperties()}
      </div>
    </div>
  );
};

export default PropertyPanel;
