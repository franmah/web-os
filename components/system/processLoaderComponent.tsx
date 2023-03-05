import { Fragment, useContext, useEffect } from "react";
import { ProcessContext } from "../../contexts/processContext";
import { isEventOriginatedFromWithinTargetIdSubtree } from "../../services/EventService";
import { CONTEXT_MENU_ROOT_ID } from "./contextMenu/ContextMenuRootComponent";
import WindowComponent from "./window/window";

export function ProcessLoaderComponent() {

  const processContext = useContext(ProcessContext);

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
          .entries(processContext.processes)
          .map(([id, { Component, params, hasWindow }]) =>
            hasWindow ?
              <WindowComponent key={id}> <Component key={id} params={params}/> </WindowComponent>
              :
              <Component key={id} params={params}></Component>
          )
      }
    </Fragment>
  );
};