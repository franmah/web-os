import { Fragment, useContext, useEffect } from "react";
import { ProcessContext } from "../../contexts/processContext";

export function ProcessLoaderComponent() {

  const processContext = useContext(ProcessContext);

  const closeContextMenu = () => {
    if (processContext.processes['contextMenu'])
      processContext.closeProcess('contextMenu');
  };

  useEffect(() => {
    document.addEventListener('mousedown', closeContextMenu);
    return () => {
      document.removeEventListener('mousedown', closeContextMenu);
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