import { FC, useEffect, useState } from "react";
import { DEFAULT_WINDOW_STATE } from "../../constants/system/window/WindowConsts";
import { Processes } from "../../types/system/processes/processes";
import { WindowState } from "../../types/system/window/WindowState";
import WindowComponent from "./window/window";

type WindowManagerState = {
  [windowId: string]: WindowState
}

export const WindowManagerComponent: FC<{ processes: Processes }> = ({ processes }) => {

  const [windowProps, setWindowProps] = useState<WindowManagerState>({});

  useEffect(() => {
    setWindowProps(currentState => {
      return Object.entries(processes).reduce((updatedState, [_, process] ) => {
        const windowId = process.windowParams?.windowId || '';
        
        if (currentState[windowId]) {
          return {
            ...updatedState,
            [windowId]: {
              ...currentState[windowId]
            }
          }
        } else {
          return {
            ...updatedState,
            [windowId]: DEFAULT_WINDOW_STATE 
          };
        }
      }, {} as WindowManagerState);

    });
  }, [processes]);

  return (
    <>
      {
        Object.entries(processes)
          .map(([id, process]) => {

            return (
              <WindowComponent
                key={id}
                startingPosition={{ top: 100, left: 100 }}
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
}