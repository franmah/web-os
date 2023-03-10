import { FC } from "react";
import { Process } from "../../types/system/processes/processes";
import WindowComponent from "./window/window";

const ProcessRenderer: FC<{ id: string, process: Process }> = ({ id, process: { params, hasWindow, Component, windowParams } }) => {
  return hasWindow ?
    <WindowComponent key={windowParams?.windowId} windowParams={{ ...windowParams }}> 
      <Component params={params}/>
    </WindowComponent>
    :
    <Component key={id} params={params}></Component>
};

export default ProcessRenderer;