import { Storage } from './storage';
import { uniqueId } from './utils';
import { Constant } from './constant';

class StoreKey {
  appPrefix: string;
  clientId: string;
  sessionId: string;
  enabled: string;
  events: string;
  constructor(appKey: string = '') {
    this.appPrefix = appKey ? `${appKey}-` : '';

    this.clientId = this.getKey('cid');
    this.sessionId = this.getKey('sid');
    this.enabled = this.getKey('enabled');
    this.events = this.getKey('events');
  }
  getKey(key: string) {
    return `${Constant.OA_PREFIX}-${this.appPrefix}${key}`;
  }
}
type StoreKeyIns = InstanceType<typeof StoreKey>;

export interface EventData {
  event: string; // 事件名
  time: number; // 事件采集时间
  data: Record<string, any>; // 上报的事件数据
  sId: string; // 会话id
}

interface ReportOptions {
  immediate: boolean; // 是否立即上报
}
interface EventHeader {
  cId: string; // 客户端唯一标识，清除浏览器缓存销毁
}
interface ReportData {
  header: EventHeader;
  body: EventData[];
}
type RequestFn = (data: ReportData) => Promise<void>;

export interface OpenAnalyticsParams {
  request: (data: ReportData) => Promise<void>; // 上报数据的接口
  appKey?: string; // 采集app的key，用于区分多app上报
  immediate?: boolean; // 全局设置是否立即上报
  requestInterval?: number; //上报间隔
}

const store = new Storage(localStorage);

/**
 * 初始化通用数据
 * @param appKey {string}
 */
function initHeader(keys: StoreKeyIns): EventHeader {
  const aKey = keys.clientId;
  const clientId = store.getAlways(aKey, () => uniqueId('', Constant.ID_LENGTH)).value;

  return {
    cId: clientId,
  };
}
/**
 * 获取会话id，每次获取，延长有效期
 * @param keys
 */
function getSessionId(sKey: string) {
  const sId = store.get(sKey);
  if (!sId.value) {
    const value = uniqueId('', Constant.ID_LENGTH);
    store.set(sKey, uniqueId('', Constant.ID_LENGTH), {
      expire: Date.now() + Constant.SESSION_EXPIRE_TIME,
    });
    return value;
  } else if (sId.expire < Date.now()) {
    store.setExpire(sKey, Date.now() + Constant.SESSION_EXPIRE_TIME);
  }
  return sId.value;
}

export class OpenAnalytics {
  request: RequestFn;
  eventData: EventData[];
  immediate: boolean;
  clientId: string = '';
  sessionId: string = '';
  appKey: string = '';
  header: EventHeader;
  enabled?: boolean;
  StoreKey: StoreKeyIns;
  // 自定义上报策略
  requestPlan?: (requestFn: () => void) => void;
  // 上报间隔，默认3s
  requestInterval: number;
  timer: number | null;
  /**
   * 构造函数
   * @param params {OpenAnalyticsParams}
   */
  constructor(params: OpenAnalyticsParams) {
    this.request = params.request;
    this.eventData = [];
    this.immediate = params.immediate ?? false;
    this.appKey = params.appKey ?? '';
    this.StoreKey = new StoreKey(params.appKey);
    this.header = initHeader(this.StoreKey);
    this.requestInterval = params.requestInterval ?? Constant.DEFAULT_REQUEST_INTERVAL;
    this.timer = null;

    this.enabled = store.getAlways(this.StoreKey.enabled, () => Constant.OA_ENABLED).value;
  }
  /**
   * 控制是否发送数据上报
   * @param enabled
   */
  enableReporting(enabled: boolean = true) {
    if (this.enabled !== enabled) {
      this.enabled = enabled;
      store.set(this.StoreKey.enabled, enabled ? Constant.OA_ENABLED : Constant.OA_DISABLED);
    }

    if (this.enabled) {
      this.runRequestPlan();
    } else if (this.timer) {
      clearTimeout(this.timer);
    }
  }
  /**
   * 搜集数据
   */
  collect(data: EventData, immediate?: boolean) {
    this.eventData.push(data);

    store.set(this.StoreKey.events, this.eventData);

    this.runRequestPlan(immediate);
  }
  /**
   * 执行上报策略
   * @param immediate
   */
  runRequestPlan(immediate?: boolean) {
    if (immediate || this.immediate) {
      this.doSendEventData();
    } else {
      if (this.requestPlan) {
        this.requestPlan(this.doSendEventData);
      } else {
        const run = () => {
          this.timer = window.setTimeout(() => {
            this.doSendEventData();
            run();
          }, this.requestInterval);
        };
        run();
      }
    }
  }
  /**
   * 发起数据上报
   */
  doSendEventData() {
    if (!this.request || !this.enabled || this.eventData.length === 0) {
      return;
    }
    const reportData = {
      header: this.header,
      body: this.eventData,
    };
    const rlt = this.request(reportData);
    if (rlt && rlt.then) {
      rlt.then(() => {
        this.eventData = [];
        store.set(this.StoreKey.events, '');
      });
    } else {
      this.eventData = [];
      store.set(this.StoreKey.events, '');
    }
  }
  /**
   * 采集数据
   * @param event 事件名
   * @param data 事件数据
   * @param options 配置
   */
  report(event: string, data: Record<string, any>, options?: ReportOptions): void {
    const eventData: EventData = {
      event: event,
      time: Date.now(),
      data: data,
      sId: getSessionId(this.StoreKey.sessionId),
    };

    this.collect(eventData, options?.immediate);
  }
}
