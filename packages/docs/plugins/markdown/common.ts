import { type MarkdownItAsyncOptions } from 'markdown-it-async';
import lineNumber from './lineNumber';
import popover from './popover';
import wrapTable from './wrapTable';
import wrapCodeContainer from './wrapCodeContainer';
import link from './link';

export const markdownItOptions: MarkdownItAsyncOptions = {
  html: true,
  linkify: true,
  typographer: true,
};
export const markdownItPlugins = [lineNumber, popover, wrapCodeContainer, wrapTable, link];
