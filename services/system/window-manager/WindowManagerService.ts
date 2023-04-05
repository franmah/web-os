import { CustomMaximizeDirection } from "../../../components/system/window/maximizeOptionsModal/maximizeOptionsModal";
import { WINDOW_STARTING_POSITION_OFFSET_PX } from "../../../constants/system/window-manager/WindowManagerConsts";
import { DEFAULT_WINDOW_STATE } from "../../../constants/system/window/WindowConsts";
import { WindowResizeDirection } from "../../../constants/system/window/WindowResizeDirectionEnum";
import { WindowedProcesses } from "../../../types/system/processes/processes";
import { WindowManagerState } from "../../../types/system/window-manager/WindowManagerState";
import { WindowState } from "../../../types/system/window/WindowState";
import { heightMaximizeWindow, maximizeOrRestoreWindow } from "../window/MaximizeRestoreWindowService";
import { moveWindow } from "../window/MoveWindowService";
import { getWindowOptionForCustomMaximize } from "../window/WindowCustomMaximizeOptionService.ts";
import { resizeWindow } from "../window/WindowResizeService";
import { stopMovingAndResizingWindow } from "../window/WindowService";
import { getStartingZindex, updateZindexesOnWindowClicked, updateZindexesOnWindowCloses } from "./WindowZindexService";


export const updateWindowStatesOnNewProcess = (processes: WindowedProcesses, currentStates: WindowManagerState): WindowManagerState => {

  const windowStates: WindowManagerState = {};

  for (let processId in processes) {
    const process = processes[processId];
    const windowId = process.windowParams.windowId;
    const isNewProcess = !!currentStates[windowId];

    const state: WindowState = isNewProcess ?
      {
        ...currentStates[windowId].state
      } :
      { 
        ...DEFAULT_WINDOW_STATE,
        ...getWindowStartingPosition(Object.values(windowStates).map(ws => ws.state)),
        zIndex: getStartingZindex(Object.keys(windowStates).length)
      };

    windowStates[windowId] = {
      process,
      state
    };
  }

  return windowStates;
};

// TODO: not 100% correct because runs only one pass.
const getWindowStartingPosition = (currentWindows: WindowState[]): { top: number, left: number } => {
  let startingTop = DEFAULT_WINDOW_STATE.top;
  let startingLeft = DEFAULT_WINDOW_STATE.left;

  for (let { top, left } of currentWindows) {
    if (startingLeft === left && startingTop === top) {
      startingTop += WINDOW_STARTING_POSITION_OFFSET_PX;
      startingLeft += WINDOW_STARTING_POSITION_OFFSET_PX;
    }
  }

  return {
    top: startingTop,
    left: startingLeft
  };
};

export type WindowManagerZindex = {
  windowId: string;
  zIndex: number;
};

export const handleZindexesUpdateOnCloseWindow = (windowId: string, windows: WindowManagerState): WindowManagerState => {
  const currentZindexes: WindowManagerZindex[] = Object
      .entries(windows)
      .map(([windowId, { state }]) => ({ windowId, zIndex: state.zIndex }));
    const updatedZindexes = updateZindexesOnWindowCloses(currentZindexes, windowId);

    for (const updatedZindex of updatedZindexes) {
      windows[updatedZindex.windowId].state.zIndex = updatedZindex.zIndex;
    }

    return { ...windows };
}

export const updateWindowsOnMouseDown = (clickedWindowId: string, windows: WindowManagerState): WindowManagerState => {
  const updatedWindows = { ...windows };

  const currentZindexes: WindowManagerZindex[] = Object
    .entries(windows)
    .map(([windowId, { state }]) => ({ windowId, zIndex: state.zIndex }));
  const updatedZindexByWindowId = updateZindexesOnWindowClicked(currentZindexes, clickedWindowId);

  // TODO: move to its own service
  for (const update of updatedZindexByWindowId) {
    const windowId = update.windowId;
    updatedWindows[windowId].state.focused = windowId === clickedWindowId;
    updatedWindows[windowId].state.zIndex = update.zIndex;
  }

  return { ...updatedWindows };
;}

export const updateWindowsOnMouseMove = (windowId: string, windows: WindowManagerState, event: MouseEvent): WindowManagerState => {
  const windowState = windows[windowId];

      if (!windowState) {
        console.error(`Error handling mouse move: Window ${windowId} not in WindowStates`);
        return windows;
      }

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
}

export const setWindowAsMoving = (windowId: string, windows: WindowManagerState, event: MouseEvent): WindowManagerState => {
  return {
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
  };
};

export const setWindowAsResizing = (windowId: string, windows: WindowManagerState, event: MouseEvent, direction: WindowResizeDirection): WindowManagerState => {
  return {
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
  };
};

export const updateWindowsOnMouseUp = (windowId: string, windows: WindowManagerState, event: MouseEvent): WindowManagerState => {
  return {
    ...windows,
    [windowId]: {
      process: windows[windowId].process,
      state: { 
        ...windows[windowId].state,
        ...stopMovingAndResizingWindow(event.clientX, event.clientY, windows[windowId].state)
      }
    }
  };
};

export const updateWindowsOnMaximize = (windowId: string, windows: WindowManagerState): WindowManagerState => {
  return {
    ...windows,
    [windowId]: {
      process: windows[windowId].process,
      state: { 
        ...windows[windowId].state,
        ...maximizeOrRestoreWindow(windows[windowId].state)
      }
    }
  };
};

export const updateWindowOnHeightMaximize = (windowId: string, windows: WindowManagerState): WindowManagerState => {
  return {
    ...windows,
    [windowId]: {
      process: windows[windowId].process,
      state: {
        ...windows[windowId].state,
        ...heightMaximizeWindow(windows[windowId].state)
      }
    }
  };
};

export const updateWindowOnCustomMaximize = (windowId: string, windows: WindowManagerState, direction: CustomMaximizeDirection): WindowManagerState => {
  return {
    ...windows,
    [windowId]: {
      process: windows[windowId].process,
      state: { 
        ...windows[windowId].state,
        ...getWindowOptionForCustomMaximize(direction, window.innerWidth, window.innerHeight)
      }
    }
  };
};