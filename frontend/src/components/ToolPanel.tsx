interface Tool {
  id: string;
  name: string;
  icon: React.ReactElement;
  description: string;
}

interface ToolPanelProps {
  selectedTool: string;
  onToolSelect: (toolId: string) => void;
}

const tools: Tool[] = [
  { 
    id: 'select', 
    name: 'Select', 
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
      </svg>
    ),
    description: 'Selection tool' 
  },
  { 
    id: 'crop', 
    name: 'Crop', 
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    description: 'Crop image' 
  },
  { 
    id: 'brightness', 
    name: 'Brightness', 
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    description: 'Adjust brightness' 
  },
  { 
    id: 'contrast', 
    name: 'Contrast', 
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
      </svg>
    ),
    description: 'Adjust contrast' 
  },
  { 
    id: 'saturation', 
    name: 'Saturation', 
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    ),
    description: 'Adjust saturation' 
  },
  { 
    id: 'blur', 
    name: 'Blur', 
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
        {/* Three soft circles to represent blur */}
        <circle cx="7.5" cy="12" r="2.6" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="12" cy="8" r="1.8" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="16.5" cy="13" r="3.1" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    description: 'Adjust Blur' 
  },
  { 
    id: 'filters', 
    name: 'Filters', 
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
      </svg>
    ),
    description: 'Apply filters' 
  },
  { 
    id: 'rotate', 
    name: 'Rotate', 
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
    description: 'Rotate image' 
  },
  { 
    id: 'flip', 
    name: 'Flip', 
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
    description: 'Flip image' 
  },
];

const ToolPanel = ({ selectedTool, onToolSelect }: ToolPanelProps) => {
  return (
    <div className="h-full flex flex-col items-center py-4 space-y-2">
      {tools.map((tool) => (
        <button
          key={tool.id}
          onClick={() => onToolSelect(tool.id)}
          className={`group relative p-3 rounded-lg transition-all ${
            selectedTool === tool.id
              ? 'bg-[#8b3dff] text-white'
              : 'text-gray-400 hover:text-white hover:bg-gray-800'
          }`}
          title={tool.description}
        >
          {tool.icon}
          
          {/* Tooltip */}
          <div className="absolute left-full ml-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
            {tool.name}
            <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
          </div>
        </button>
      ))}
    </div>
  );
};

export default ToolPanel;
