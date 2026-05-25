import { nextTick } from 'vue';

/**
 * Vue tick级别的函数去重执行工具
 *
 * 功能特性：
 * 1. 同一个函数引用在单个Vue tick内只会被执行一次
 * 2. 所有在当前tick内注册的函数会在下一个tick统一批量执行
 * 3. 自动去重重复注册的相同函数
 *
 * @returns 接收待执行函数的包装器
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
