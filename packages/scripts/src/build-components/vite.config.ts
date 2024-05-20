import { InlineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { globSync } from 'glob';
import dts from 'vite-plugin-dts';

const langs = globSync('src/locale/lang/*.ts');

export default (): InlineConfig => {
  return {
    plugins: [
      vue(),
      // dts(),
      dts({
        outDir: ['es', 'lib'],
      }),
    ],
    build: {
      target: 'modules',
      outDir: 'es',
      emptyOutDir: false,
      minify: false,
      rollupOptions: {
        input: ['src/index.ts', 'src/icon/index.ts', ...langs],
        output: [
          {
            format: 'es',
            dir: 'es',
            entryFileNames: '[name].mjs',
            preserveModules: true,
            preserveModulesRoot: 'src',
          },
          {
            format: 'commonjs',
            dir: 'lib',
            entryFileNames: '[name].js',
            preserveModules: true,
            preserveModulesRoot: 'src',
          },
        ],
        external: ['vue'],
      },
      lib: {
        entry: 'src/index.ts',
        // formats: ['es', 'cjs'],
      },
    },
  };
};
