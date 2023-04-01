import { STARTING_WINDOW_COMPONENT_ZINDEX } from "../../../constants/Zindex";
import { WINDOW_STARTING_POSITION_OFFSET_PX } from "../../../constants/system/window-manager/WindowManagerConsts";
import { DEFAULT_WINDOW_STATE } from "../../../constants/system/window/WindowConsts";
import { WindowedProcesses } from "../../../types/system/processes/processes";
import { WindowManagerState } from "../../../types/system/window-manager/WindowManagerState";
import { WindowState } from "../../../types/system/window/WindowState";


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
        zIndex: STARTING_WINDOW_COMPONENT_ZINDEX + Object.values(currentStates).length
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
};

export type WindowManagerZindex = {
  windowId: string;
  zIndex: number;
};

/**
 * Update the clicked window to have the highest zIndex compared to other windows. 
 * This is so that the window can show above others.
 * Other's windows' zIndex is updated to be lower than the clicked window.
 * Max zIndex == numbers of windows - 1.
 * @param indexes 
 * @param clickedWindowId 
 * @returns 
 */
export const updateZindexesOnWindowSelected = (indexes: WindowManagerZindex[], clickedWindowId: string): WindowManagerZindex[] => {
  const sortedIndexes = [...indexes].sort((w1, w2) => w1.zIndex - w2.zIndex);
  
  const selectedWindowZindex = sortedIndexes.find(index => index.windowId === clickedWindowId);
  if (!selectedWindowZindex || !selectedWindowZindex.zIndex) {
    console.error(`Error updating windows Zindexes: window ${clickedWindowId} not found.`);
    return indexes;
  }

  // Update every index that is higher than the selected's window old index to be lower.
  sortedIndexes.forEach(i => {
    i.zIndex = i.zIndex > selectedWindowZindex.zIndex ?
      i.zIndex - 1 :
      i.zIndex;
  });

  selectedWindowZindex.zIndex = STARTING_WINDOW_COMPONENT_ZINDEX + indexes.length - 1;
  
  return sortedIndexes;
};