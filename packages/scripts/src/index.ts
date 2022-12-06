import path from 'path';
import fs from 'fs-extra';
import { Command } from 'commander';

import { buildIcons } from './gen-icons';
import { buildComponents } from './build-components';

const program = new Command();

const packageStr = fs.readFileSync(path.resolve(__dirname, '../package.json'), 'utf-8');
const packageJson = JSON.parse(packageStr);

program.name('opensig-scripts')
  .version(packageJson.version)
  .usage('command [options] ');

program.command('gen:icons')
  .description('generate opendesign icon components')
  .action(() => {
    buildIcons();
  });

program.command('build:components')
  .description('generate opendesign icon components')
  .action(() => {
    buildComponents();
  });


program.parse(process.argv);