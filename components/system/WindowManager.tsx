import { FC, useEffect, useState } from "react";
import { getEveryWindowPositions, getNewWindowPosition } from "../../services/system/window-manager/WindowManagerService";
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

  // TODO: Remove once whole window state is lifted up in manager.
  useEffect(() => {
    setForcedPositions(positions => {
      return getNewWindowPosition(processes, positions);
    });
  }, [processes]);
    
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