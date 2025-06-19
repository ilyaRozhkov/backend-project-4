#!/usr/bin/env node
import { program } from 'commander';
import debug from 'debug';
import app from '../src/index.js';

const log = debug('page-loader');

program
  .description('Page loader utility')
  .version('1.0.0', '-V, --version', 'output the version number')
  .option('-o, --output [dir]', 'output dir', process.cwd())
  .arguments('<url>')
  .action((url, options) => {
    const { output } = options;
    log('The application has started');
    app(url, output)
      .then(() => {
        log('Application completed successfully');
        process.exit(0);
      })
      .catch((e) => {
        console.error(`Application failed with error '${e.message}'`);
        process.exit(1);
      });
  });

program.parse();
