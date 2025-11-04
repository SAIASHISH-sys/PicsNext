interface HistoryPanelProps {
  history: string[];
  currentIndex: number;
  onUndo: () => void;
  onRedo: () => void;
}

const HistoryPanel = ({ history, currentIndex, onUndo, onRedo }: HistoryPanelProps) => {
  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  return (
    <div className="bg-white border-t border-gray-300 p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-800">History</h2>
        <div className="flex space-x-2">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              canUndo
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
            title="Undo (Ctrl+Z)"
          >
            ↶ Undo
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              canRedo
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
            title="Redo (Ctrl+Y)"
          >
            ↷ Redo
          </button>
        </div>
      </div>
      
      <div className="space-y-1 max-h-32 overflow-y-auto">
        {history.length === 0 ? (
          <p className="text-sm text-gray-500 italic">No actions yet</p>
        ) : (
          history.map((action, index) => (
            <div
              key={index}
              className={`px-3 py-2 rounded text-sm ${
                index === currentIndex
                  ? 'bg-blue-100 text-blue-800 font-medium'
                  : index < currentIndex
                  ? 'bg-gray-50 text-gray-600'
                  : 'bg-gray-50 text-gray-400'
              }`}
            >
              <span className="text-xs text-gray-500 mr-2">#{index + 1}</span>
              {action}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HistoryPanel;
