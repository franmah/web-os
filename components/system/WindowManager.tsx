import { FC, useEffect, useState } from "react";
import { v4 } from "uuid";
import { DEFAULT_WINDOW_STATE } from "../../constants/system/window/WindowConsts";
import { Process, Processes } from "../../types/system/processes/processes";
import { WindowState } from "../../types/system/window/WindowState";
import WindowComponent from "./window/window";

type WindowManagerState = {
  [windowId: string]: {
    state: WindowState,
    process: Process
  }
};

export const WindowManagerComponent: FC<{ processes: Processes }> = ({ processes }) => {

  const [windows, setWindows] = useState<WindowManagerState>({});

  // update windows (state) by adding or removing new/old processes
  useEffect(() => {
    setWindows(currentStates => {
      const windowStates: WindowManagerState = {};

      for (let processId in processes) {
        const process = processes[processId];
        const windowId = process.windowParams?.windowId || v4();
  
        windowStates[windowId] = {
          process,
          state: {
            ...(currentStates[windowId]?.state || DEFAULT_WINDOW_STATE),
          }
        }
      }

      return windowStates;
    });
  }, [processes]);

  const setWindowState = (windowId: string, state: WindowState) => {
    setWindows(windows => ({
      ...windows,
      [windowId]: {
        process: windows[windowId].process,
        state: { 
          ...windows[windowId].state,
          ...state
        }
      }
    }));
  };

  return (
    <>
      {
        Object.entries(windows)
          .map(([windowId, { process, state }]) => {
            return (
              <WindowComponent
                key={windowId}
                windowParams={process.windowParams}
                options={state}
                setOptions={setWindowState}
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