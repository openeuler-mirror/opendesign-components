import path from 'path';
import fs from 'fs-extra';
import { Command } from 'commander';

import buildIcons from './gen-icons';
import buildComponents from './build-components';
import buildStyle from './build-style';
import genTokens, { TokenOptionsT } from './gen-tokens';

const program = new Command();

const packageStr = fs.readFileSync(path.resolve(__dirname, '../package.json'), 'utf-8');
const packageJson = JSON.parse(packageStr);

program.name('opensig-scripts')
  .version(packageJson.version)
  .usage('command [options] ');

program.command('gen:icon')
  .description('generate opendesign icon components')
  .action(() => {
    buildIcons();
  });

program.command('build:component')
  .description('build opendesign components')
  .action(() => {
    buildComponents();
  });

program.command('build:style')
  .description('build opendesign style')
  .action(() => {
    buildStyle();
  });

program.command('gen:token')
  .description('generate opendesign tokens')
  .option('-c, --config <configFile>', 'config file')
  .action((options: TokenOptionsT) => {
    genTokens(options);
  });

program.parse(process.argv);