import dynamic from 'next/dynamic';
import { Processes } from '../../types/processes/processes';

export const startingProccesses: Processes = {
  'desktop': {
    name: 'desktop',
    Component: dynamic(() => import('../../components/desktop/desktop/DesktopComponent')),
  },
  'taskbar': {
    name: 'taskbar',
    Component: dynamic(() => import('../../components/taskbar/Taskbar'))
  }
}