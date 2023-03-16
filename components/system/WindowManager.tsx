import { FC, useEffect, useState } from "react";
import { Processes } from "../../types/system/processes/processes";
import WindowComponent from "./window/window";

export type WindowForcedPositions = {
  [windowId: string]: {
    top: number,
    left: number,
    width: number,
    height: number
  }
};

export const WindowManagerComponent: FC<{ processes: Processes }> = ({ processes }) => {

  const [windowForcedPositions, setForcedPositions] = useState<WindowForcedPositions>({});

  useEffect(() => {
   setNewWindowPosition();
  }, [processes]);
  
  const setNewWindowPosition = () => {
    const currentWindowIds = Object.keys(windowForcedPositions);
    const process = Object.values(processes).find(process => {
      const windowId = process.windowParams?.windowId || '';
      return !currentWindowIds.includes(windowId);
    });

    if (!process) { return; }

    const newWindowId = process.windowParams?.windowId || '';

    setForcedPositions(positions => {
      return {
        ...positions,
        [newWindowId]: {
          top: Math.random() * 150,
          left: Math.random() * 150,
          height: Math.random() * 400,
          width: Math.random() * 400
        }
      }
    });
  }
  
  return (
    <>
      {
        Object.entries(processes)
          .map(([id, process]) => {
            const windowId = process.windowParams?.windowId || '';
            return (
              <WindowComponent
                key={id}
                forcedPosition={windowForcedPositions[windowId]}
                windowParams={process.windowParams}
              >
                <process.Component 
                  params={process.params}
                />
              </WindowComponent>
             
            )
          })
      }
    </>
  )
};