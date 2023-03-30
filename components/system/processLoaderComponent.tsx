import { FC, Fragment, useContext, useEffect } from "react";
import { ProcessContext } from "../../contexts/processContext";
import { isEventOriginatedFromWithinTargetIdSubtree } from "../../services/EventService";
import { Processes, WindowedProcesses } from "../../types/system/processes/processes";
import { CONTEXT_MENU_ROOT_ID } from "./contextMenu/ContextMenuRootComponent";
import { WindowManagerComponent } from "./WindowManager";
import { startingProccesses } from "../../System/process/StartingProccesses";

export const ProcessLoaderComponent: FC<{}> = () => {

  const processContext = useContext(ProcessContext);

  const windowedProcesses: Processes = {};
  const nonWindowedProceses: Processes = {};

  // Load starting processes
  useEffect(() => {
    for (let processName in startingProccesses) {
      processContext.openProcess(processName);
    }
  }, []);

  Object.entries(processContext.processes).forEach(([id, process]) => {
    if (process.hasWindow)
      windowedProcesses[id] = process;
    else
      nonWindowedProceses[id] = process;
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
          .map(([processId, { Component, params }]) =>
            <Component key={processId} params={params}></Component>
          )
      }
      {
        <WindowManagerComponent 
          processes={windowedProcesses as WindowedProcesses}
        />
      }
    </Fragment>
  );
};