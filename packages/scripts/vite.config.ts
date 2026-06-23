import { isAbsolute } from 'node:path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    target: 'node18',
    lib: {
      entry: './src/index.ts',
      formats: ['es'],
    },
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      external: (id) => !id.startsWith('.') && !id.startsWith('\0') && !isAbsolute(id),
      output: {
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].mjs',
      },
    },
  },
  plugins: [
    dts({
      outDirs: ['dist'],
      entryRoot: 'src',
      tsconfigPath: 'tsconfig.json',
    }),
  ],
});
