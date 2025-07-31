export const CodeContainer: (typeof import('@/components/CodeContainer.vue'))['default'];
export const DemoContainer: (typeof import('@/components/DemoContainer.vue'))['default'];
export const DemoUsage: (typeof import('@/components/DemoUsage.vue'))['default'];

declare module 'vue' {
  export interface GlobalComponents {
    CodeContainer: (typeof import('@/components/CodeContainer.vue'))['default'];
    DemoContainer: (typeof import('@/components/DemoContainer.vue'))['default'];
    DemoUsage: (typeof import('@/components/DemoUsage.vue'))['default'];
  }
}
