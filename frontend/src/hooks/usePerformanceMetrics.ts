import { useEffect, useRef, useState } from 'react';

interface PerformanceMetrics {
  fps: number;
  avgLatency: number;
  currentLatency: number;
}

interface InteractionEvent {
  timestamp: number;
  type: string;
}

/**
 * Hook to track UI performance metrics including FPS and input latency
 */
export const usePerformanceMetrics = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    avgLatency: 0,
    currentLatency: 0,
  });

  const frameTimestamps = useRef<number[]>([]);
  const latencies = useRef<number[]>([]);
  const pendingInteraction = useRef<InteractionEvent | null>(null);
  const rafId = useRef<number | undefined>(undefined);

  // Track FPS using requestAnimationFrame
  useEffect(() => {
    const measureFPS = (currentTime: number) => {
      frameTimestamps.current.push(currentTime);

      // Keep only last 60 frames (approx 1 second at 60fps)
      if (frameTimestamps.current.length > 60) {
        frameTimestamps.current.shift();
      }

      // Calculate FPS from frame timestamps
      if (frameTimestamps.current.length > 1) {
        const timespan =
          frameTimestamps.current[frameTimestamps.current.length - 1] -
          frameTimestamps.current[0];
        const fps = ((frameTimestamps.current.length - 1) / timespan) * 1000;

        setMetrics((prev) => ({
          ...prev,
          fps: Math.round(fps),
        }));
      }

      rafId.current = requestAnimationFrame(measureFPS);
    };

    rafId.current = requestAnimationFrame(measureFPS);

    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, []);

  /**
   * Record the start of a user interaction
   * @param type - Type of interaction (e.g., 'filter', 'crop', 'rotate')
   */
  const recordInteractionStart = (type: string) => {
    pendingInteraction.current = {
      timestamp: performance.now(),
      type,
    };
  };

  /**
   * Record the end of an interaction (when effect is applied/visible)
   */
  const recordInteractionEnd = () => {
    if (pendingInteraction.current) {
      const latency = performance.now() - pendingInteraction.current.timestamp;
      latencies.current.push(latency);

      // Keep only last 20 latencies for rolling average
      if (latencies.current.length > 20) {
        latencies.current.shift();
      }

      // Calculate average latency
      const avgLatency =
        latencies.current.reduce((sum, l) => sum + l, 0) /
        latencies.current.length;

      setMetrics((prev) => ({
        ...prev,
        avgLatency: Math.round(avgLatency),
        currentLatency: Math.round(latency),
      }));

      pendingInteraction.current = null;
    }
  };

  /**
   * Reset all metrics
   */
  const resetMetrics = () => {
    frameTimestamps.current = [];
    latencies.current = [];
    pendingInteraction.current = null;
    setMetrics({
      fps: 0,
      avgLatency: 0,
      currentLatency: 0,
    });
  };

  return {
    metrics,
    recordInteractionStart,
    recordInteractionEnd,
    resetMetrics,
  };
};
