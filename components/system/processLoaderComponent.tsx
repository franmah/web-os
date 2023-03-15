import { FC, Fragment, useContext, useEffect } from "react";
import { ProcessContext } from "../../contexts/processContext";
import { isEventOriginatedFromWithinTargetIdSubtree } from "../../services/EventService";
import { Processes } from "../../types/system/processes/processes";
import { CONTEXT_MENU_ROOT_ID } from "./contextMenu/ContextMenuRootComponent";
import ProcessRenderer from "./processRendererComponent";
import { WindowManagerComponent } from "./WindowManager";

export const ProcessLoaderComponent: FC<{}> = () => {

  const processContext = useContext(ProcessContext);

  const windowedProcesses: Processes = {};
  const nonWindowedProceses: Processes = {};

  Object.entries(processContext.processes).forEach(([id, process]) => {
    if (process.hasWindow)
      windowedProcesses[id] = process;
    else
      nonWindowedProceses[id] = process
  });

  const closeContextMenu = (event: MouseEvent) => {
    const isContextProcessOpen = !!processContext.processes['contextMenu'];
    const isMouseDownInContextMenu = isEventOriginatedFromWithinTargetIdSubtree(event, CONTEXT_MENU_ROOT_ID);
    if (isContextProcessOpen && !isMouseDownInContextMenu) {
      processContext.closeProcess('contextMenu');
    }
  };

  const onContextMenuClick = (event: MouseEvent) => {
    event.preventDefault();
  };

  useEffect(() => {
    document.addEventListener('mousedown', closeContextMenu, true);
    document.addEventListener('contextmenu', onContextMenuClick, true);
    return () => {
      document.removeEventListener('mousedown', closeContextMenu, true);
      document.removeEventListener('contextmenu', onContextMenuClick, true);
    };
  });

  return (
    <Fragment>
      {
        Object
          .entries(nonWindowedProceses)
          .map(([id, process]) =>

            <ProcessRenderer
              key={id}
              id={id}
              process={process}
            />
          )
      }
      
      <WindowManagerComponent 
        processes={windowedProcesses}
      />
      
    </Fragment>
  );
};