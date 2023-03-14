import dynamic from "next/dynamic";
import { Process } from "../../types/system/processes/processes";

export const ProcessDirectory:  { [name: string]: Process } = {
  'contextMenu': {
    name: 'contextMenu',
    Component: dynamic<{ params: any }>(() => import('../../components/system/contextMenu/ContextMenuRootComponent')),
    params: null,
    windowParams: null,
    hasWindow: false,
    isUnique: true
  },
  'desktop': {
    name: 'desktop',
    Component: dynamic<{ params: any }>(() => import('../../components/desktop/desktop/DesktopComponent')),
    params: null,
    windowParams: null,
    hasWindow: false,
    isUnique: true
  },
  'taskbar': {
    name: 'taskbar',
    Component: dynamic<{ params: any }>(() => import('../../components/taskbar-component/taskbar/Taskbar')),
    params: null,
    windowParams: null,
    hasWindow: false,
    isUnique: true
  },
  'hello': {
    name: 'hello',
    Component: dynamic<{ params: any }>(() => import('../../components/hello/helloComponent')),
    params: null,
    windowParams: { headerOptions: { icon: '/icons/youtube-logo.png',text: 'Youtube Player' } },
    hasWindow: true,
    isUnique: false
  }
};