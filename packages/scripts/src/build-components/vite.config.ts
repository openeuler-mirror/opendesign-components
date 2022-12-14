import { InlineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default (): InlineConfig => {
  return {
    plugins: [vue()],
    build: {
      target: 'modules',
      outDir: 'es',
      emptyOutDir: false,
      minify: false,
      rollupOptions: {
        input: ['src/components/index.ts', 'src/components/icons/index.ts'],
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
      lib: {
        entry: 'src/components/index.ts',
        formats: ['es', 'cjs'],
      },
    },
  };
};
