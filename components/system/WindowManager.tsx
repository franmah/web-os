import { FC, useContext, useEffect, useState } from "react";
import { ProcessContext } from "../../contexts/processContext";
import { WindowManagerZindex, updateWindowStatesOnNewProcess } from "../../services/system/window-manager/WindowManagerService";
import { WindowedProcesses } from "../../types/system/processes/processes";
import { WindowManagerState } from "../../types/system/window-manager/WindowManagerState";
import WindowComponent from "./window/window";
import { WindowResizeDirection } from "../../constants/system/window/WindowResizeDirectionEnum";
import { isEventOriginatedFromWithinTargetIdSubtree } from "../../services/EventService";
import { moveWindow } from "../../services/system/window/MoveWindowService";
import { resizeWindow } from "../../services/system/window/WindowResizeService";
import { stopMovingAndResizingWindow } from "../../services/system/window/WindowService";
import { maximizeOrRestoreWindow } from "../../services/system/window/MaximizeRestoreWindowService";
import { getWindowOptionForCustomMaximize } from "../../services/system/window/WindowCustomMaximizeOptionService.ts";
import { CustomMaximizeDirection } from "./window/maximizeOptionsModal/maximizeOptionsModal";
import { updateZindexesOnWindowClicked, updateZindexesOnWindowCloses } from "../../services/system/window-manager/WindowZindexService";

export const WindowManagerComponent: FC<{ processes: WindowedProcesses }> = ({ processes }) => {

  const { closeProcess } = useContext(ProcessContext);

  const [windows, setWindows] = useState<WindowManagerState>({});

  // update windows (state) by adding or removing new/old processes
  useEffect(() => {
    setWindows(currentStates => {
      return updateWindowStatesOnNewProcess(processes, currentStates);
    });
  }, [processes]);

  // Unselect all windows when there is a click outside a window.
  // Reset event listeners when number of windows changes.
  useEffect(() => {
    document.addEventListener('mousedown', unfocusWindowsOnDocumentMouseDown);
    return (() => {
      document.removeEventListener('mousedown', unfocusWindowsOnDocumentMouseDown);
    });
  }, [Object.keys(windows).length]);
  
  
  const closeWindow = (windowId: string) => {
    const processId = windows[windowId]?.process?.processId;

    // Update zIndexes of other windows
    setWindows(currentWindows => {
      const currentZindexes: WindowManagerZindex[] = Object
        .entries(windows)
        .map(([windowId, { state }]) => ({ windowId, zIndex: state.zIndex }));
      const updatedZindexes = updateZindexesOnWindowCloses(currentZindexes, windowId);

      for (const updatedZindex of updatedZindexes) {
        windows[updatedZindex.windowId].state.zIndex = updatedZindex.zIndex;
      }

      return { ...currentWindows };
    });

    if (!processId) {
      console.warn(`Error trying to close window, processId not found (windowId: ${windowId})`)
    } else {
      closeProcess(processId);
    }
  };

  const unfocusWindowsOnDocumentMouseDown = (event: MouseEvent) => {
    const noWindowComponentClicked = Object
      .keys(windows)
      .every(windowId => !isEventOriginatedFromWithinTargetIdSubtree(event, windowId));

    if (noWindowComponentClicked) {
      setWindows(currentWindows => {
        Object.values(currentWindows)
          .forEach(w => w.state.selected = false);
        return { ...currentWindows };
      });
    }
  };

  const handleWindowMouseDown = (clickedWindowId: string) => {
    setWindows(windows => {
      const updatedWindows = { ...windows };

      const currentZindexes: WindowManagerZindex[] = Object
        .entries(windows)
        .map(([windowId, { state }]) => ({ windowId, zIndex: state.zIndex }));
      const updatedZindexByWindowId = updateZindexesOnWindowClicked(currentZindexes, clickedWindowId);

      for (const update of updatedZindexByWindowId) {
        const windowId = update.windowId;
        updatedWindows[windowId].state.selected = windowId === clickedWindowId;
        updatedWindows[windowId].state.zIndex = update.zIndex;
      }

      return { ...updatedWindows };
    });
  };

  const hanldeMouseMove = (windowId: string, event: MouseEvent) => {
    setWindows(windows => {
      const windowState = windows[windowId];

      if (windowState.state.moving) {
        return {
          ...windows,
          [windowId]: {
            process: windows[windowId].process,
            state: { 
              ...windows[windowId].state,
              ...moveWindow(event, windows[windowId].state)
            }
          }
        };
      } else if (windowState.state.resizeDirection !== WindowResizeDirection.None) {
        return {
          ...windows,
          [windowId]: {
            process: windows[windowId].process,
            state: { 
              ...windows[windowId].state,
              ...resizeWindow(event.clientX, event.clientY, windows[windowId].state)
            }
          }
        };
      }

      return windows;
    });
  };

  const handleStartMoving = (windowId: string, event: MouseEvent) => {
    setWindows(windows => ({
      ...windows,
      [windowId]: {
        process: windows[windowId].process,
        state: { 
          ...windows[windowId].state,
          moving: true,
          previousClientX: event.clientX,
          previousClientY: event.clientY
        }
      }
    }));
  };

  const handleStartResizing = (windowId: string, event: MouseEvent, direction: WindowResizeDirection) => {
    setWindows(windows => ({
      ...windows,
      [windowId]: {
        process: windows[windowId].process,
        state: { 
          ...windows[windowId].state,
          previousClientX: event.clientX,
          previousClientY: event.clientY,
          resizeDirection: direction
        }
      }
    }));
  };

  const handleMouseUp = (windowId: string, event: MouseEvent) => {
    setWindows(windows => ({
      ...windows,
      [windowId]: {
        process: windows[windowId].process,
        state: { 
          ...windows[windowId].state,
          ...stopMovingAndResizingWindow(event.clientX, event.clientY, windows[windowId].state)
        }
      }
    }));
  };

  const handleMaximize = (windowId: string, event: MouseEvent) => {
    setWindows(windows => ({
      ...windows,
      [windowId]: {
        process: windows[windowId].process,
        state: { 
          ...windows[windowId].state,
          ...maximizeOrRestoreWindow(windows[windowId].state)
        }
      }
    }));
  };

  const handleMoveToCustomMaximizeOptionClick = (windowId: string, direction: CustomMaximizeDirection) => {
    setWindows(windows => ({
      ...windows,
      [windowId]: {
        process: windows[windowId].process,
        state: { 
          ...windows[windowId].state,
          ...getWindowOptionForCustomMaximize(direction, window.innerWidth, window.innerHeight)
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
                closeWindow={closeWindow}
                handleWindowMouseDown={handleWindowMouseDown}
                hanldeMouseMove={hanldeMouseMove}
                handleStartMoving={handleStartMoving}
                handleStartResizing={handleStartResizing}
                handleMouseUp={handleMouseUp}
                handleMaximize={handleMaximize}
                handleMoveToCustomMaximizeOptionClick={handleMoveToCustomMaximizeOptionClick}
              >
                <process.Component 
                  params={process.params}
                />
              </WindowComponent>
            );
          })
      }
    </>
  )
};