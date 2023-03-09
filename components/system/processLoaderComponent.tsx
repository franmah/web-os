import { Fragment, useContext, useEffect } from "react";
import { v4 } from "uuid";
import { ProcessContext } from "../../contexts/processContext";
import { isEventOriginatedFromWithinTargetIdSubtree } from "../../services/EventService";
import { CONTEXT_MENU_ROOT_ID } from "./contextMenu/ContextMenuRootComponent";
import WindowComponent from "./window/window";

// TODO: Move the code in map() to it's own ProcessRenderComponent.
export function ProcessLoaderComponent() {

  const processContext = useContext(ProcessContext);

  // TODO: remove (opens test hello component)
  useEffect(() => {
    processContext.openProcess('hello', null)
  }, [])

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
              <WindowComponent key={params?.windowId} params={{ ...params, processId: id}}> 
                <Component params={params}/>
              </WindowComponent>
              :
              <Component key={id} params={params}></Component>
          )
      }
    </Fragment>
  );
};