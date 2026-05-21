import { nextTick } from 'vue';

/**
 * 对同一个函数只会在每个vue tick最多执行一次
 */
export const useRunOnceNextTick = () => {
  const tickJobs = new Set<() => any>();
  return (fn: () => any) => {
    if (tickJobs.size === 0) {
      nextTick(() => {
        tickJobs.forEach((item) => item());
        tickJobs.clear();
      });
    }
    tickJobs.add(fn);
  };
};
