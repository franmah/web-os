import dynamic from "next/dynamic";
import { Processes } from "../../types/system/processes/processes";

export const ProcessDirectory: Processes = {
  'contextMenu': {
    name: 'contextMenu',
    Component: dynamic<{ params: any }>(() => import('../../components/system/contextMenu/ContextMenuRootComponent')),
    params: null
  }
};