interface Tool {
  id: string;
  name: string;
  icon: string;
  description: string;
}

interface ToolPanelProps {
  selectedTool: string;
  onToolSelect: (toolId: string) => void;
}

const tools: Tool[] = [
  { id: 'select', name: 'Select', icon: '⬚', description: 'Selection tool' },
  { id: 'crop', name: 'Crop', icon: '✂', description: 'Crop image' },
  { id: 'brightness', name: 'Brightness', icon: '☀', description: 'Adjust brightness' },
  { id: 'contrast', name: 'Contrast', icon: '◐', description: 'Adjust contrast' },
  { id: 'saturation', name: 'Saturation', icon: '🎨', description: 'Adjust saturation' },
  { id: 'filters', name: 'Filters', icon: '✨', description: 'Apply filters' },
  { id: 'rotate', name: 'Rotate', icon: '↻', description: 'Rotate image' },
  { id: 'flip', name: 'Flip', icon: '⇆', description: 'Flip image' },
];

const ToolPanel = ({ selectedTool, onToolSelect }: ToolPanelProps) => {
  return (
    <div className="bg-white border-r border-gray-300 p-4 overflow-y-auto">
      <h2 className="text-lg font-bold text-gray-800 mb-4">Tools</h2>
      <div className="space-y-2">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => onToolSelect(tool.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
              selectedTool === tool.id
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            title={tool.description}
          >
            <span className="text-2xl">{tool.icon}</span>
            <span className="font-medium text-sm">{tool.name}</span>
          </button>
        ))}
      </div>
      
      <div className="mt-8 pt-6 border-t border-gray-300">
        <h3 className="text-sm font-semibold text-gray-600 mb-3">Quick Actions</h3>
        <div className="space-y-2">
          <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
            Reset All
          </button>
          <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
            Auto Enhance
          </button>
        </div>
      </div>
    </div>
  );
};

export default ToolPanel;
