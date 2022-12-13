import { InlineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default (): InlineConfig => {
  return {
    plugins: [vue()],
    build: {
      lib: {
        entry: 'components/index.ts',
        formats: ['es', 'cjs'],
      },
      target: 'modules',
      outDir: 'es',
      emptyOutDir: false,
      minify: false,
      rollupOptions: {
        input: ['components/index.ts', 'components/icons/index.ts'],
        output: [
          {
            format: 'es',
            dir: 'es',
            entryFileNames: '[name].js',
            preserveModules: true,
            preserveModulesRoot: 'components',
          },
          {
            format: 'commonjs',
            dir: 'lib',
            entryFileNames: '[name].js',
            preserveModules: true,
            preserveModulesRoot: 'components',
          },
        ],
        external: ['vue'],
      },
    },
  };
};
