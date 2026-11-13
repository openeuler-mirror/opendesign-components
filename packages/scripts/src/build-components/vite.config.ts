import { InlineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { globSync } from 'glob';
import dts from 'vite-plugin-dts';

const langs = globSync('src/locale/lang/*.ts');

export default (): InlineConfig => {
  return {
    plugins: [
      // comments: false —— 模板里的 HTML 注释默认会被编译成 createCommentVNode 落进产物，构建侧必须显式关闭
      vue({ template: { compilerOptions: { comments: false } } }) as any,
      // dts(),
      dts({
        outDir: ['es', 'lib'],
        tsconfigPath: 'tsconfig.app.json',
        // 与 Rollup 的 preserveModulesRoot: 'src' 对齐，
        // 避免 .d.ts 落入 es/src/... 与 .mjs 的 es/... 路径错位
        entryRoot: 'src',
      }) as any,
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
        external: ['vue', /^@vueuse/, /^dayjs/],
      },
      lib: {
        entry: 'src/index.ts',
        // formats: ['es', 'cjs'],
      },
    },
  };
};
