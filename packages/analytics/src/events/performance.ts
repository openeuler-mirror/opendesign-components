import { OpenEventKeys } from './keys';
import { onFCP, onTTFB } from 'web-vitals';

interface PerformanceData {
  fcp: number;
  ttfb: number;
  load: number;
  navigationEntry?: PerformanceNavigationTiming;
}
export default {
  event: OpenEventKeys.PageBasePerformance,
  collector: () => {
    return new Promise((resolve) => {
      const data: PerformanceData = {
        fcp: -1,
        ttfb: -1,
        load: -1,
      };
      let doneFcp = false;
      let doneTtfb = false;

      const doResolve = () => {
        if (doneFcp && doneTtfb) {
          resolve(data);
        }
      };

      onFCP((m) => {
        data.fcp = m.value;
        doneFcp = true;
        doResolve();
      });
      onTTFB((m) => {
        doneTtfb = true;
        const entry = m.entries[0];
        data.ttfb = m.value;
        data.navigationEntry = entry;
        data.load = entry.domComplete - entry.startTime;
        doResolve();
      });
    });
  },
};
