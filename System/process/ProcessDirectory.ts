import dynamic from "next/dynamic";
import { WindowParams } from "../../types/system/window/WindowProps";

export type ProcessDirectoryEntry = {
  name: string;
  Component: React.ComponentType<{ params: any }>;
  defaultParams?: any;
  isUnique: boolean;
  hasWindow: boolean;
  windowParams?: Partial<WindowParams>;
};

export type ProcessDirectoryType = {
  [processName: string]: ProcessDirectoryEntry;
};

export const ProcessDirectory: ProcessDirectoryType = {
  'contextMenu': {
    name: 'contextMenu',
    Component: dynamic<{ params: any }>(() => import('../../components/system/contextMenu/ContextMenuRootComponent')),
    hasWindow: false,
    isUnique: true
  },
  'desktop': {
    name: 'desktop',
    Component: dynamic<{ params: any }>(() => import('../../components/desktop/desktop/DesktopComponent')),
    defaultParams: null,
    hasWindow: false,
    isUnique: true
  },
  'taskbar': {
    name: 'taskbar',
    Component: dynamic<{ params: any }>(() => import('../../components/taskbar-component/taskbar/Taskbar')),
    hasWindow: false,
    isUnique: true
  },
  'hello': {
    name: 'hello',
    Component: dynamic<{ params: any }>(() => import('../../components/hello/helloComponent')),
    windowParams: {
      headerOptions: {
        icon: '/icons/youtube-logo.png',
        text: 'Youtube Player'
      }
    },
    hasWindow: true,
    isUnique: false
  }
};