import dynamic from "next/dynamic";
import { ProcessDirectoryType } from "../../types/system/processes/processes";

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
  'explorer': {
    name: 'hello',
    Component: dynamic<{ params: { startPath: string } }>(() => import('../../components/explorer/explorer-container')),
    windowParams: {
      headerOptions: {
        icon: '/icons/youtube-logo.png',
        text: 'Explorer'
      }
    },
    hasWindow: true,
    isUnique: false
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
  },
  'sunTextEditor': {
    name: 'sunTextEditor',
    Component: dynamic<{ params: { originalContent: string } }>(() => import('../../components/text-editor-app/suneditor')),
    windowParams: {
      headerOptions: {
        text: 'Text Editor'
      }
    },
    hasWindow: true,
    isUnique: false,
    iconPath: '/icons/text-icon.png'
  }
};