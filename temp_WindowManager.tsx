import { FC, useContext, useEffect, useState } from "react";
import { ProcessContext } from "../../contexts/processContext";
import { updateWindowStatesOnNewProcess } from "../../services/system/window-manager/WindowManagerService";
import { WindowedProcesses } from "../../types/system/processes/processes";
import { WindowManagerState } from "../../types/system/window-manager/WindowManagerState";
import { WindowState } from "../../types/system/window/WindowState";
import WindowComponent from "./window/window";

export const WindowManagerComponent: FC<{ processes: WindowedProcesses }> = ({ processes }) => {

  const { closeProcess } = useContext(ProcessContext);

  const [windows, setWindows] = useState<WindowManagerState>([]);

  // update windows (state) by adding or removing new/old processes
  useEffect(() => {
    setWindows(currentStates => {
      return updateWindowStatesOnNewProcess(processes, currentStates);
    });
  }, [processes]);

  const setWindowState = (windowId: string, state: WindowState, stuff?: string) => {
    setWindows(currentWwindows => {
      console.log({ [windowId]: `${state.selected}, origin ${stuff}` })
      const index = currentWwindows.findIndex(w => w.windowId === windowId);
      if (index === -1) {
        throw Error(`Error setting window ${windowId} state: can't find find window state`);
      }

      const updatedWindow = {
        ...currentWwindows[index],
        state: { 
          ...currentWwindows[index].state,
          ...state
        }
      }

      if (updatedWindow.state.selected) {
        currentWwindows.splice(index, 1);
        currentWwindows.push(updatedWindow);
      } 

      // console.log(currentWwindows.map(w => w.windowId))
      return [...currentWwindows];
    });
  };

  const closeWindow = (windowId: string) => {
    const window = windows.find(w => w.windowId === windowId);
    const processId = window?.process?.processId;

    if (!processId || !window) {
      console.warn(`Error trying to close window, windowsId or processId not found (windowId: ${windowId})`);
    } else {
      closeProcess(processId);
    }
  }

  return (
    <>
      {
        windows.map(({ windowId, process, state }) => {
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