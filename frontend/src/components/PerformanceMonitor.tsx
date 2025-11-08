import { usePerformanceMetrics } from '../hooks/usePerformanceMetrics';

interface PerformanceMonitorProps {
  show?: boolean;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export const PerformanceMonitor = ({ 
  show = true, 
  position = 'top-right' 
}: PerformanceMonitorProps) => {
  const { metrics } = usePerformanceMetrics();

  if (!show) return null;

  const getFPSColor = (fps: number) => {
    if (fps >= 55) return '#4ade80'; // green - excellent
    if (fps >= 30) return '#fbbf24'; // yellow - acceptable
    return '#f87171'; // red - poor
  };

  const getLatencyColor = (latency: number) => {
    if (latency <= 16) return '#4ade80'; // green - 60fps (16.67ms)
    if (latency <= 33) return '#fbbf24'; // yellow - 30fps (33.33ms)
    return '#f87171'; // red - below 30fps
  };

  const getLatencyLabel = (latency: number) => {
    if (latency <= 16) return 'Excellent';
    if (latency <= 33) return 'Good';
    if (latency <= 50) return 'Fair';
    return 'Poor';
  };

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
  };

  return (
    <div 
      className={`fixed ${positionClasses[position]} z-[9999] min-w-[200px] 
        bg-gray-900/95 backdrop-blur-lg border border-purple-500/30 rounded-lg p-3 
        shadow-xl shadow-black/40 hover:shadow-2xl hover:shadow-black/50 
        transition-all duration-200`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-purple-500/20">
        <span className="text-purple-400 font-semibold text-xs uppercase tracking-wider">
          Performance
        </span>
        <span className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_#4ade80] animate-pulse" />
      </div>
      
      {/* Metrics */}
      <div className="flex flex-col gap-3">
        {/* FPS Metric */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="text-white/60 text-[10px] uppercase tracking-wide font-medium">
              FPS
            </span>
            <span 
              className="text-white/50 text-[10px] cursor-help hover:text-white/100 transition-opacity"
              title="Frames Per Second - measures render smoothness"
            >
              ⓘ
            </span>
          </div>
          <div className="flex items-baseline gap-1">
            <span 
              className="text-2xl font-bold font-mono leading-none min-w-[45px] transition-colors duration-300"
              style={{ color: getFPSColor(metrics.fps) }}
            >
              {metrics.fps}
            </span>
            <span className="text-white/40 text-[11px] font-medium">fps</span>
          </div>
          {/* FPS Bar */}
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mt-1">
            <div 
              className="h-full rounded-full transition-all duration-300"
              style={{ 
                width: `${Math.min((metrics.fps / 60) * 100, 100)}%`,
                backgroundColor: getFPSColor(metrics.fps)
              }}
            />
          </div>
        </div>

        {/* Average Latency */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="text-white/60 text-[10px] uppercase tracking-wide font-medium">
              Avg Latency
            </span>
            <span 
              className="text-white/50 text-[10px] cursor-help hover:text-white/100 transition-opacity"
              title="Average time between user action and visual update"
            >
              ⓘ
            </span>
          </div>
          <div className="flex items-baseline gap-1">
            <span 
              className="text-2xl font-bold font-mono leading-none min-w-[45px] transition-colors duration-300"
              style={{ color: getLatencyColor(metrics.avgLatency) }}
            >
              {metrics.avgLatency}
            </span>
            <span className="text-white/40 text-[11px] font-medium">ms</span>
          </div>
          <div 
            className="text-[10px] font-semibold uppercase tracking-wider mt-0.5"
            style={{ color: getLatencyColor(metrics.avgLatency) }}
          >
            {getLatencyLabel(metrics.avgLatency)}
          </div>
        </div>

        {/* Current Latency */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="text-white/60 text-[10px] uppercase tracking-wide font-medium">
              Current
            </span>
            <span 
              className="text-white/50 text-[10px] cursor-help hover:text-white/100 transition-opacity"
              title="Latest interaction latency"
            >
              ⓘ
            </span>
          </div>
          <div className="flex items-baseline gap-1">
            <span 
              className="text-2xl font-bold font-mono leading-none min-w-[45px] transition-colors duration-300"
              style={{ color: getLatencyColor(metrics.currentLatency) }}
            >
              {metrics.currentLatency}
            </span>
            <span className="text-white/40 text-[11px] font-medium">ms</span>
          </div>
        </div>
      </div>
    </div>
  );
};
