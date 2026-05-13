import path from 'node:path';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { Command } from 'commander';

import buildIcons from './gen-icon/index.ts';
import cleanSvgs from './clean-svg/index.ts';
import buildComponents from './build-components/index.ts';
import buildStyle from './build-style/index.ts';
import genTokens from './gen-token/index.ts';

const program = new Command();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const packageStr = readFileSync(path.resolve(__dirname, '../package.json'), 'utf-8');
const packageJson = JSON.parse(packageStr);

program.name('open-scripts').version(packageJson.version).usage('command [options] ');

program
  .command('gen:icon')
  .description('generate opendesign icon components')
  .option('-c, --config <configFile>', 'config file')
  .action((options) => {
    buildIcons(options);
  });
program
  .command('clean:svg')
  .description('generate opendesign icon components')
  .option('-c, --config <configFile>', 'config file')
  .action((options) => {
    cleanSvgs(options);
  });

program
  .command('build:component')
  .description('build opendesign components')
  .action(() => {
    buildComponents();
  });

program
  .command('build:style')
  .description('build opendesign style')
  .action(() => {
    buildStyle();
  });

program
  .command('gen:token')
  .description('generate opendesign tokens')
  .option('-c, --config <configFile>', 'config file')
  .action((options) => {
    genTokens(options);
  });

program.parse(process.argv);
