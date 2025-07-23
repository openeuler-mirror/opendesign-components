export type DocDemoSchema =
  | {
      type: 'boolean';
      default?: boolean;
      label?: string;
    }
  | {
      type: 'list';
      list: Array<string | number>;
      default?: string | number;
      label?: string;
    }
  | {
      type: 'string';
      default?: string;
      label?: string;
    }
  | {
      type: 'textarea';
      default?: string;
      label?: string;
      row?: number;
    }
  | {
      type: 'number';
      step?: number;
      min?: number;
      max?: number;
      default?: number;
      label?: string;
    }
  | {
      type: 'radio';
      default?: string | number;
      list: Array<string | number>;
    };

export type DocDemoState<T> = T extends Record<string, any>
  ? {
      [key in keyof T]: T[key] extends {
        type: 'list';
        list: Array<infer U>;
      }
        ? U
        : T[key] extends {
            type: 'radio';
            list: Array<infer U>;
          }
        ? U
        : T[key] extends {
            type: 'boolean';
          }
        ? boolean
        : T[key] extends {
            type: 'number';
          }
        ? number
        : T[key] extends {
            type: 'string';
          }
        ? string
        : never;
    }
  : T;

export type DocDemoTemplate<T> = ((props: DocDemoState<T>) => string) | string;
export type DocDemoStyle<T> = ((props: DocDemoState<T>) => string) | string;
