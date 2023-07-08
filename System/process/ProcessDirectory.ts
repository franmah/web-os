import dynamic from "next/dynamic";
import { ProcessDirectoryType } from "../../types/system/processes/Processes";

export const ProcessDirectory: ProcessDirectoryType = {
  'contextMenu': {
    name: 'contextMenu',
    Component: dynamic<{ params: any }>(() => import('../../components/system/context-menu/ContextMenuRoot')),
    hasWindow: false,
    isUnique: true
  },
  'desktop': {
    name: 'desktop',
    Component: dynamic<{ params: any }>(() => import('../../components/desktop/desktop/Desktop')),
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
    name: 'explorer',
    Component: dynamic<{ params: { startPath: string } }>(() => import('../../components/explorer/ExplorerContainer')),
    windowParams: {
      headerOptions: {
        icon: '/icons/youtube-logo.png',
        text: 'Explorer'
      }
    },
    hasWindow: true,
    isUnique: false
  },
  'youtube': {
    name: 'youtube',
    Component: dynamic<{ params: any }>(() => import('../../components/youtube/Youtube')),
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
    Component: dynamic<{ params: { originalContent: string } }>(
      () => import('../../components/text-editor-app/Suneditor') as any
    ),
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