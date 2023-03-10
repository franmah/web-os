import { FC, Fragment, useContext, useEffect } from "react";
import { ProcessContext } from "../../contexts/processContext";
import { isEventOriginatedFromWithinTargetIdSubtree } from "../../services/EventService";
import { CONTEXT_MENU_ROOT_ID } from "./contextMenu/ContextMenuRootComponent";
import ProcessRenderer from "./processRendererComponent";

export const ProcessLoaderComponent: FC<{}> = () => {

  const processContext = useContext(ProcessContext);

  // TODO: remove (opens test hello component)
  useEffect(() => {
    processContext.openProcess('hello');
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
          .map(([id, process]) =>

            <ProcessRenderer
              key={id}
              id={id}
              process={process}
            />
          )
      }
    </Fragment>
  );
};