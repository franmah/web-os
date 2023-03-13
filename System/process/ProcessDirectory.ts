import dynamic from "next/dynamic";
import { WindowParams } from "../../components/system/window/window";

export type ProcessDirectoryEntry = {
  [name: string]: {
    name: string,
    Component: React.ComponentType<{ params: any }>,
    params: any,
    windowParams: Partial<WindowParams> | null,
    hasWindow: boolean
  }
};

export const ProcessDirectory: ProcessDirectoryEntry = {
  'contextMenu': {
    name: 'contextMenu',
    Component: dynamic<{ params: any }>(() => import('../../components/system/contextMenu/ContextMenuRootComponent')),
    params: null,
    windowParams: null,
    hasWindow: false
  },
  'desktop': {
    name: 'desktop',
    Component: dynamic<{ params: any }>(() => import('../../components/desktop/desktop/DesktopComponent')),
    params: null,
    windowParams: null,
    hasWindow: false
  },
  'taskbar': {
    name: 'taskbar',
    Component: dynamic<{ params: any }>(() => import('../../components/taskbar-component/taskbar/Taskbar')),
    params: null,
    windowParams: null,
    hasWindow: false
  },
  'hello': {
    name: 'hello',
    Component: dynamic<{ params: any }>(() => import('../../components/hello/helloComponent')),
    params: null,
    windowParams: { headerOptions: { icon: '/icons/youtube-logo.png',text: 'Youtube Player dddddddddddddddddddddddddddddddddddddddd' } },
    hasWindow: true
  }
};