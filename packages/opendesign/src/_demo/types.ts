export type DocDemoSchema =
  | {
      type: 'boolean';
      default?: boolean;
      label?: string;
      disabled?: boolean;
    }
  | {
      type: 'list';
      list: Array<string | number | undefined> | Readonly<Array<string | number | undefined>>;
      default?: string | number;
      label?: string;
      disabled?: boolean;
    }
  | {
      type: 'string';
      default?: string;
      label?: string;
      disabled?: boolean;
    }
  | {
      type: 'textarea';
      default?: string;
      label?: string;
      row?: number;
      disabled?: boolean;
    }
  | {
      type: 'number';
      step?: number;
      min?: number;
      max?: number;
      default?: number;
      label?: string;
      disabled?: boolean;
    }
  | {
      type: 'radio';
      default?: string | number;
      list: Array<string | number>;
      disabled?: boolean;
    };

export type DocDemoState<T> =
  T extends Record<string, any>
    ? {
        [key in keyof T]: T[key] extends {
          type: 'list';
          list: Array<infer U>;
          label?: string;
        }
          ? U
          : T[key] extends {
                type: 'radio';
                list: Array<infer U>;
                label?: string;
              }
            ? U
            : T[key] extends {
                  type: 'boolean';
                  label?: string;
                }
              ? boolean
              : T[key] extends {
                    type: 'number';
                    label?: string;
                  }
                ? number
                : T[key] extends {
                      type: 'string';
                      label?: string;
                    }
                  ? string
                  : never;
      }
    : T;

export type DocDemoTemplate<T> = ((props: DocDemoState<T>) => string) | string;
export type DocDemoStyle = string;
