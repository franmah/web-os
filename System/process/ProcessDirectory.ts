import dynamic from "next/dynamic";
import { Processes } from "../../types/system/processes/processes";

export const ProcessDirectory: Processes = {
  'contextMenu': {
    name: 'contextMenu',
    Component: dynamic<{ params: any }>(() => import('../../components/system/contextMenu/ContextMenuRootComponent')),
    params: null,
    hasWindow: false
  },
  'desktop': {
    name: 'desktop',
    Component: dynamic<{ params: any }>(() => import('../../components/desktop/desktop/DesktopComponent')),
    params: null,
    hasWindow: false
  },
  'taskbar': {
    name: 'taskbar',
    // TODO: fix <any> once component changed to function component
    Component: dynamic<any>(() => import('../../components/taskbar-component/taskbar/Taskbar')),
    params: null,
    hasWindow: false
  },
  'hello': {
    name: 'hello',
    Component: dynamic<any>(() => import('../../components/hello/helloComponent')),
    params: null,
    hasWindow: true
  }
};