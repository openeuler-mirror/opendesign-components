type StorageInstance = typeof localStorage | typeof sessionStorage;
interface StorageSetOptions {
  expire?: number;
  once?: boolean;
}
export class Storage {
  store: StorageInstance = localStorage;
  constructor(storage: StorageInstance) {
    this.store = storage;
  }
  set(key: string, value: any, options?: StorageSetOptions) {
    const { once, expire } = options || {};

    const data = {
      expire,
      value,
      once,
    };

    this.store.setItem(key, JSON.stringify(data));
  }
  setExpire(key: string, expire: number) {
    const { value } = this.get(key);
    this.set(key, value, {
      expire,
    });
  }
  get(key: string) {
    const dataStr = this.store.getItem(key);
    if (!dataStr) {
      return {
        value: null,
      };
    }
    try {
      const { once, expire, value } = JSON.parse(dataStr);
      if (expire < Date.now()) {
        return {
          value: null,
        };
      }
      if (once) {
        this.store.removeItem(key);
      }
      return { expire, value };
    } catch {
      return {
        value: null,
      };
    }
  }
  getAlways(key: string, callback: () => any, options?: StorageSetOptions) {
    let { value } = this.get(key);
    if (value === null) {
      value = callback();
      this.set(key, value, options);
    }
    return {
      value,
      expire: options?.expire,
    };
  }
}
