export const Constant = {
  OA_PREFIX: 'oa', // 本地存储key的前缀
  ID_LENGTH: 36, // 标识id长度
  OA_ENABLED: '1', // 开启采集标识
  OA_DISABLED: '0', // 关闭采集标识
  SESSION_EXPIRE_TIME: 30 * 60 * 1000, // 会话标识有效期
  CLIENT_EXPIRE_TIME: 180 * 24 * 60 * 60 * 1000, // 设备标识有效期
  DEFAULT_REQUEST_INTERVAL: 5 * 1000, // 默认上报间隔
  MAX_EVENTS: 500, // 本地最大存储事件数 150k~
};
