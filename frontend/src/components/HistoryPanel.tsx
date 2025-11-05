interface HistoryPanelProps {
  history: string[];
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const HistoryPanel = ({ history }: HistoryPanelProps) => {
  return (
    <div className="p-4 border-t border-gray-800">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-300">History</h3>
        <span className="text-xs text-gray-500">{history.length} actions</span>
      </div>
      
      <div className="space-y-1 max-h-48 overflow-y-auto custom-scrollbar">
        {history.length === 0 ? (
          <p className="text-xs text-gray-500 italic py-2">No actions yet</p>
        ) : (
          history.slice(-10).map((action, index) => {
            const actualIndex = history.length - 10 + index;
            
            return (
              <div
                key={actualIndex}
                className="px-2 py-1.5 rounded text-xs bg-gray-800 text-gray-300 transition-colors"
              >
                <span className="text-[10px] opacity-60 mr-1.5">#{actualIndex + 1}</span>
                {action}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default HistoryPanel;
