import { Fragment, useContext, useEffect } from "react";
import { ProcessContext } from "../../contexts/processContext";

export function ProcessLoaderComponent() {

  const processContext = useContext(ProcessContext);

  const closeContextMenu = () => {
    if (processContext.processes['contextMenu'])
      processContext.closeProcess('contextMenu');
  };

  useEffect(() => {
    document.addEventListener('mousedown', closeContextMenu, true);
    return () => {
      document.removeEventListener('mousedown', closeContextMenu, true);
    };
  });

  return (
    <Fragment>
      {
        Object
          .entries(processContext.processes)
          .map(([id, { Component }]) => <Component key={id}></Component>)
      }
    </Fragment>
  );
}