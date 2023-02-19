import dynamic from 'next/dynamic';
import { Processes } from '../../types/system/processes/processes';

export const startingProccesses: Processes = {
  'desktop': {
    name: 'desktop',
    Component: dynamic<{ params: any }>(() => import('../../components/desktop/desktop/DesktopComponent')),
    params: null
  },
  'taskbar': {
    name: 'taskbar',
    // TODO: fix <any> once component changed to function component
    Component: dynamic<any>(() => import('../../components/taskbar/Taskbar')),
    params: null
  }
};