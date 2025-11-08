import { useState } from 'react';
import './App.css';
import ImageCanvas from './components/ImageCanvas';
import ToolPanel from './components/ToolPanel';
import PropertyPanel from './components/PropertyPanel';
import HistoryPanel from './components/HistoryPanel';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { undo, redo } from './store/imageEditorSlice';

function App() {
  const dispatch = useAppDispatch();
  const imageState = useAppSelector(state => state.imageEditor.present);
  const canUndo = useAppSelector(state => state.imageEditor.past.length > 0);
  const canRedo = useAppSelector(state => state.imageEditor.future.length > 0);
  
  const [selectedTool, setSelectedTool] = useState('select');
  const [history, setHistory] = useState<string[]>([]);
  const [showPropertyPanel, setShowPropertyPanel] = useState(true);

  const handleHistoryChange = (action: string) => {
    setHistory(prev => [...prev, action]);
  };

  const handleUndo = () => {
    dispatch(undo());
  };

  const handleRedo = () => {
    dispatch(redo());
  };

  return (
    <div className="h-screen flex flex-col bg-[#0d0c22]">
      {/* Canva-style Top Toolbar */}
      <header className="bg-[#18171f] border-b border-gray-800 shadow-lg">
        <div className="px-4 py-2 flex items-center justify-between">
          {/* Left: Logo and Project Name */}
          <div className="flex items-center space-x-4 pl-10">
            <div className="flex items-center space-x-2">
              <span className="text-2xl ">📷</span>
              <h1 className="text-2xl  font-bold text-white">PicsNext</h1>
            </div>
          </div>

          {/* Center: Undo/Redo */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleUndo}
              disabled={!canUndo}
              className={`p-2 rounded transition ${
                canUndo
                  ? 'text-white hover:bg-gray-800'
                  : 'text-gray-600 cursor-not-allowed'
              }`}
              title="Undo (Ctrl+Z)"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
            </button>
            <button
              onClick={handleRedo}
              disabled={!canRedo}
              className={`p-2 rounded transition ${
                canRedo
                  ? 'text-white hover:bg-gray-800'
                  : 'text-gray-600 cursor-not-allowed'
              }`}
              title="Redo (Ctrl+Y)"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Tool Panel (Canva-style icon bar) */}
        <aside className="w-20 bg-[#18171f] border-r border-gray-800 hidden md:block">
          <ToolPanel selectedTool={selectedTool} onToolSelect={setSelectedTool} />
        </aside>

        {/* Center - Canvas Area */}
        <main className="flex-1 flex flex-col overflow-hidden bg-[#0d0c22]">
          <ImageCanvas
            selectedTool={selectedTool}
            brightness={imageState.brightness}
            contrast={imageState.contrast}
            saturation={imageState.saturation}
            blur={imageState.blur}
            onHistoryChange={handleHistoryChange}
          />
        </main>

        {/* Right Sidebar - Property Panel (Canva-style) */}
        {showPropertyPanel && (
          <aside className="w-80 bg-[#18171f] border-l border-gray-800 hidden lg:flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto">
              <PropertyPanel
                selectedTool={selectedTool}
                brightness={imageState.brightness}
                contrast={imageState.contrast}
                saturation={imageState.saturation}
                blur={imageState.blur}
              />
            </div>
            
            {/* History at bottom of right panel */}
            <div className="border-t border-gray-800">
              <HistoryPanel
                history={history}
                onUndo={handleUndo}
                onRedo={handleRedo}
                canUndo={canUndo}
                canRedo={canRedo}
              />
            </div>
          </aside>
        )}

        {/* Toggle Property Panel Button */}
        <button
          onClick={() => setShowPropertyPanel(!showPropertyPanel)}
          className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-l-lg shadow-lg transition z-10"
          style={{ right: showPropertyPanel ? '320px' : '0' }}
        >
          <svg 
            className={`w-4 h-4 transition-transform ${showPropertyPanel ? '' : 'rotate-180'}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* Mobile Tool Panel - Bottom */}
      <div className="md:hidden bg-[#18171f] border-t border-gray-800 p-2 overflow-x-auto">
        <div className="flex space-x-2">
          {['select', 'crop', 'brightness', 'contrast', 'saturation', 'filters'].map((tool) => (
            <button
              key={tool}
              onClick={() => setSelectedTool(tool)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${
                selectedTool === tool
                  ? 'bg-[#8b3dff] text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {tool.charAt(0).toUpperCase() + tool.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Property Panel - Collapsible */}
      {selectedTool !== 'select' && (
        <div className="lg:hidden bg-[#18171f] border-t border-gray-800 p-4 max-h-48 overflow-y-auto">
          <PropertyPanel
            selectedTool={selectedTool}
            brightness={imageState.brightness}
            contrast={imageState.contrast}
            saturation={imageState.saturation}
            blur={imageState.blur}
          />
        </div>
      )}
    </div>
  );
}

export default App;
