import { FC, useContext, useEffect, useState } from "react";
import { ProcessContext } from "../../contexts/processContext";
import { updateWindowStatesOnNewProcess } from "../../services/system/window-manager/WindowManagerService";
import { WindowedProcesses } from "../../types/system/processes/processes";
import { WindowManagerState } from "../../types/system/window-manager/WindowManagerState";
import { WindowState } from "../../types/system/window/WindowState";
import WindowComponent from "./window/window";

export const WindowManagerComponent: FC<{ processes: WindowedProcesses }> = ({ processes }) => {

  const { closeProcess } = useContext(ProcessContext);

  const [windows, setWindows] = useState<WindowManagerState>({});

  // update windows (state) by adding or removing new/old processes
  useEffect(() => {
    setWindows(currentStates => {
      const state = updateWindowStatesOnNewProcess(processes, currentStates);
      return state;
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

  const closeWindow = (windowId: string) => {
    const processId = windows[windowId]?.process?.processId;

    if (!processId) {
      console.warn(`Error trying to close window, processId not found (windowId: ${windowId})`)
    } else {
      closeProcess(processId);
    }
  }

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
                closeWindow={closeWindow}
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