import { v4 } from "uuid";
import { WINDOW_STARTING_POSITION_OFFSET_PX } from "../../../constants/system/window-manager/WindowManagerConsts";
import { DEFAULT_WINDOW_STATE } from "../../../constants/system/window/WindowConsts";
import { WindowedProcesses } from "../../../types/system/processes/processes";
import { WindowManagerState } from "../../../types/system/window-manager/WindowManagerState";
import { WindowState } from "../../../types/system/window/WindowState";

export const updateWindowStatesOnNewProcess = (processes: WindowedProcesses, currentStates: WindowManagerState): WindowManagerState => {
  
  const windowStates: WindowManagerState = {};

  for (let processId in processes) {
    const process = processes[processId];
    const windowId = process.windowParams.windowId || v4(); // TODO: remove v4() once process type is fixed.
    const isNewProcess = !!currentStates[windowId];

    const state = isNewProcess ?
      {
        ...currentStates[windowId].state
      } :
      { 
        ...DEFAULT_WINDOW_STATE,
        ...getWindowStartingPosition(Object.values(windowStates).map(ws => ws.state))
      };

    windowStates[windowId] = {
      process,
      state
    };
  }

  return windowStates;
}

// TODO: not 100% correct: only checks in one pass.
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
}