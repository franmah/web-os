import dynamic from 'next/dynamic';
import { Processes } from '../../types/processes/processes';

export const startingProccesses: Processes = {
  'desktop': {
    name: 'desktop',
    Component: dynamic(() => import('../../components/desktop-component/desktop/Desktop')),
  },
  'taskbar': {
    name: 'taskbar',
    Component: dynamic(() => import('../../components/taskbar/Taskbar'))
  }
}