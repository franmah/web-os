import { Processes, WindowedProcesses } from '../../types/system/processes/processes';
import { ProcessDirectory } from './ProcessDirectory';

export const startingProccesses: any = {
  'desktop': {
    ...ProcessDirectory['desktop'],
    windowParams: null
  },
  'taskbar': {
    ...ProcessDirectory['taskbar'],
    windowParams: null
  },
};