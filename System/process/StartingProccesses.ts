import { Processes, WindowedProcesses } from '../../types/system/processes/Processes';
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