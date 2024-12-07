import { UPLOAD_STATES } from './constants';

export function createProgressTracker() {
  let intervalId: NodeJS.Timeout | null = null;

  const start = (onProgress: (progress: number) => void) => {
    intervalId = setInterval(() => {
      onProgress((prev: number) => Math.min(prev + 10, UPLOAD_STATES.MAX_PROGRESS));
    }, UPLOAD_STATES.PROGRESS_INTERVAL);
  };

  const stop = () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
  };

  return { start, stop };
}