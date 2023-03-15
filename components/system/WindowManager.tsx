import { FC, useEffect, useState } from "react";
import { DEFAULT_WINDOW_STATE } from "../../constants/system/window/WindowConsts";
import { Processes } from "../../types/system/processes/processes";
import { WindowState } from "../../types/system/window/WindowState";
import WindowComponent from "./window/window";

type WindowManagerState = {
  [windowId: string]: WindowState
}

export const WindowManagerComponent: FC<{ processes: Processes }> = ({ processes }) => {

  const [windowStates, setWindowStates] = useState<WindowManagerState>({});

  useEffect(() => {
    console.log('sup')
    setWindowStates(currentState => {
      const updatedState = Object.entries(processes).reduce((updatedState, [_, process] ) => {
        const windowId = process.windowParams?.windowId || '';
        if (currentState[windowId]) {
          console.log(windowId + ' is already present')
          return {
            ...updatedState,
            [windowId]: {
              ...currentState[windowId]
            }
          }
        } else {
          console.log(windowId + ' is new')
          return {
            ...updatedState,
            [windowId]: DEFAULT_WINDOW_STATE 
          };
        }
      }, {});
      console.log({updatedState})
      return updatedState
    });
  }, [processes]);

  const updateWindowState = (windowId: string, state: Partial<WindowState>, origin?: string) => {
    console.log(origin)
    setWindowStates(currentState => ({
      ...currentState,
      [windowId]: {
        ...currentState[windowId],
        ...state
      }
    }));
  } 

  return (
    <>
      {
        Object.entries(processes)
          .map(([id, process]) => {
            const windowId = process.windowParams?.windowId || '';
            const props = windowStates[windowId];
            if (props) {
              return (
                <WindowComponent
                  key={id}
                  windowId={windowId}
                  windowParams={process.windowParams}
                  state={props}
                  updateState={updateWindowState}
                  windowState={props}
                >
                  <process.Component 
                    params={process.params}
                  />
                </WindowComponent>
               
              )
            }
            else 
              return null
           
          })
      }
    </>
  )
}