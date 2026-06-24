import { InlineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import terser from '@rollup/plugin-terser';

export default (type: 'component' | 'icon'): InlineConfig => {
  const entry = type === 'component' ? 'src/index.ts' : 'src/icon/index.ts';

  const entryFileName = type === 'component' ? 'opendesign' : 'opendesign-icon';

  const name = type === 'component' ? 'opendesign' : 'opendesignIcon';

  return {
    mode: 'production',
    build: {
      target: 'es2020',
      outDir: 'dist',
      emptyOutDir: false,
      sourcemap: true,
      minify: false,
      rollupOptions: {
        external: ['vue', /^@vueuse/, 'dayjs'],
        output: [
          {
            format: 'umd',
            name: entryFileName,
            entryFileNames: `${entryFileName}.js`,
            globals(id: string) {
              if (id === 'vue') return 'Vue';
              if (id.startsWith('@vueuse/')) return 'VueUse';
              if (id === 'dayjs') return 'dayjs';
              return id;
            },
          },
          {
            format: 'umd',
            name: entryFileName,
            entryFileNames: `${entryFileName}.min.js`,
            globals(id: string) {
              if (id === 'vue') return 'Vue';
              if (id.startsWith('@vueuse/')) return 'VueUse';
              if (id === 'dayjs') return 'dayjs';
              return id;
            },
            plugins: [terser()],
          },
        ],
      },
      // 开启lib模式
      lib: {
        entry,
        name,
      },
    },
    plugins: [vue()],
  };
};
