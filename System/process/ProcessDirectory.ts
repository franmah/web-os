import dynamic from "next/dynamic";
import { Processes } from "../../types/processes/processes";

export const ProcessDirectory: Processes = {
  'contextMenu': {
    name: 'contextMenu',
    Component: dynamic(() => import('../../components/system/contextMenu/contextMenuComponent'))
  }
};