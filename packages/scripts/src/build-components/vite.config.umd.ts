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
      target: 'modules',
      outDir: 'dist',
      emptyOutDir: false,
      sourcemap: true,
      minify: false,
      rollupOptions: {
        external: 'vue',
        output: [
          {
            format: 'umd',
            name: entryFileName,
            entryFileNames: `${entryFileName}.js`,
            globals: {
              vue: 'Vue',
            },
          },
          {
            format: 'umd',
            name: entryFileName,
            entryFileNames: `${entryFileName}.min.js`,
            globals: {
              vue: 'Vue',
            },
            plugins: [terser()],
          },
        ],
      },
      // 开启lib模式
      lib: {
        entry,
        // formats: ['umd'],
        name,
      },
    },
    plugins: [vue()],
  };
};
