import { FC, useContext } from "react";
import { ProcessContext } from "../../contexts/processContext";
import { Process } from "../../types/system/processes/processes";
import WindowComponent from "./window/window";

const ProcessRenderer: FC<{ id: string, process: Process }> = ({ id, process: { params, hasWindow, Component, windowParams } }) => {

  // Temporary way to get starting position of new window.
  // TODO: replace this whole thing by a WindowManagerComponent in charge of the window's position.
  const { processes } = useContext(ProcessContext);
  const windowedProcessWindowIds = Object.entries(processes)
    .filter(([_, process]) => process.hasWindow)
    .map(([_, process]) => process.windowParams?.windowId || '')
    .map(id => {
      const element = document.getElementById(id);
      return {
        top: element?.offsetTop,
        left: element?.offsetLeft
      }
    });

    const startingPosition = {
      top: 100 + (20 * windowedProcessWindowIds.length),
      left: 100 + (20*windowedProcessWindowIds.length)
    }


    return <Component key={id} params={params}></Component>
  // return hasWindow ?
  //   <WindowComponent
  //     startingPosition={startingPosition}
  //     key={windowParams?.windowId}
  //     windowParams={{ ...windowParams }}
  //   > 
  //     <Component params={params}/>
  //   </WindowComponent>
  //   :
  //   <Component key={id} params={params}></Component>
};

export default ProcessRenderer;