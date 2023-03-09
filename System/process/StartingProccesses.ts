import { Processes } from '../../types/system/processes/processes';
import { ProcessDirectory } from './ProcessDirectory';

export const startingProccesses: Processes = {
  'desktop': ProcessDirectory['desktop'],
  'taskbar': ProcessDirectory['taskbar'],
};