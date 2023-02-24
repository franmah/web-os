import { Fragment, useContext, useEffect } from "react";
import { ProcessContext } from "../../contexts/processContext";
import { isEventOriginatedFromTarget } from "../../services/EventService";
import { CONTEXT_MENU_ROOT_ID } from "./contextMenu/ContextMenuRootComponent";

export function ProcessLoaderComponent() {

  const processContext = useContext(ProcessContext);

  const closeContextMenu = (event: MouseEvent) => {
    if (processContext.processes['contextMenu'] && !isEventOriginatedFromTarget(event, CONTEXT_MENU_ROOT_ID)) {
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
          .entries(processContext.processes)
          .map(([id, { Component, params }]) => 
            <Component key={id} params={params}></Component>
          )
      }
    </Fragment>
  );
};