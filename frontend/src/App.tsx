import { useState } from 'react';
import './App.css';
import ImageCanvas from './components/ImageCanvas';
import ToolPanel from './components/ToolPanel';
import PropertyPanel from './components/PropertyPanel';
import HistoryPanel from './components/HistoryPanel';

function App() {
  const [selectedTool, setSelectedTool] = useState('select');
  const [brightness, setBrightness] = useState(0);
  const [contrast, setContrast] = useState(0);
  const [saturation, setSaturation] = useState(100);
  const [history, setHistory] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  const handleHistoryChange = (action: string) => {
    const newHistory = history.slice(0, currentIndex + 1);
    newHistory.push(action);
    setHistory(newHistory);
    setCurrentIndex(newHistory.length - 1);
  };

  const handleUndo = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      // In a real implementation, you would restore the previous state here
    }
  };

  const handleRedo = () => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex(currentIndex + 1);
      // In a real implementation, you would restore the next state here
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-linear-to-r from-blue-600 to-blue-700 text-white shadow-lg">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">📷</span>
            <div>
              <h1 className="text-2xl font-bold">PicsNext</h1>
              <p className="text-sm text-blue-100">Professional image editing made simple</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm bg-blue-500 px-3 py-1 rounded-full">v1.0.0</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Tool Panel */}
        <aside className="w-64 hidden md:block">
          <ToolPanel selectedTool={selectedTool} onToolSelect={setSelectedTool} />
        </aside>

        {/* Center - Canvas Area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-hidden">
            <ImageCanvas
              selectedTool={selectedTool}
              brightness={brightness}
              contrast={contrast}
              saturation={saturation}
              onHistoryChange={handleHistoryChange}
            />
          </div>

          {/* Bottom - History Panel */}
          <div className="hidden lg:block">
            <HistoryPanel
              history={history}
              currentIndex={currentIndex}
              onUndo={handleUndo}
              onRedo={handleRedo}
            />
          </div>
        </main>

        {/* Right Sidebar - Property Panel */}
        <aside className="w-80 hidden lg:block">
          <PropertyPanel
            selectedTool={selectedTool}
            brightness={brightness}
            contrast={contrast}
            saturation={saturation}
            onBrightnessChange={setBrightness}
            onContrastChange={setContrast}
            onSaturationChange={setSaturation}
          />
        </aside>
      </div>

      {/* Mobile Tool Panel - Bottom Sheet */}
      <div className="md:hidden bg-white border-t border-gray-300 p-2 overflow-x-auto">
        <div className="flex space-x-2">
          {['select', 'crop', 'brightness', 'contrast', 'saturation', 'filters'].map((tool) => (
            <button
              key={tool}
              onClick={() => setSelectedTool(tool)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${
                selectedTool === tool
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {tool.charAt(0).toUpperCase() + tool.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Property Panel - Collapsible */}
      {selectedTool !== 'select' && (
        <div className="lg:hidden bg-white border-t border-gray-300 p-4 max-h-48 overflow-y-auto">
          <PropertyPanel
            selectedTool={selectedTool}
            brightness={brightness}
            contrast={contrast}
            saturation={saturation}
            onBrightnessChange={setBrightness}
            onContrastChange={setContrast}
            onSaturationChange={setSaturation}
          />
        </div>
      )}
    </div>
  );
}

export default App;
