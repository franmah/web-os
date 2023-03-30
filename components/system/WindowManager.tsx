import { FC, useEffect, useState } from "react";
import { updateWindowStatesOnNewProcess } from "../../services/system/window-manager/WindowManagerService";
import { Processes } from "../../types/system/processes/processes";
import { WindowManagerState } from "../../types/system/window-manager/WindowManagerState";
import { WindowState } from "../../types/system/window/WindowState";
import WindowComponent from "./window/window";


export const WindowManagerComponent: FC<{ processes: Processes }> = ({ processes }) => {

  const [windows, setWindows] = useState<WindowManagerState>({});

  // update windows (state) by adding or removing new/old processes
  useEffect(() => {
    setWindows(currentStates => {
      return updateWindowStatesOnNewProcess(processes, currentStates);
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