import { STARTING_WINDOW_COMPONENT_ZINDEX } from "../../../constants/Zindex";
import { WindowManagerZindex } from "./WindowManagerService";

export const getStartingZindes = (numWindowedProcesses: number): number => {
  return STARTING_WINDOW_COMPONENT_ZINDEX + numWindowedProcesses
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
export const updateZindexesOnWindowClicked = (indexes: WindowManagerZindex[], clickedWindowId: string): WindowManagerZindex[] => {
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

/**
 * @param indexes array of WindowManagerZindex before the window is closed.
 * @returns 
 */
export const updateZindexesOnWindowCloses = (indexes: WindowManagerZindex[], closingWindowId: string): WindowManagerZindex[] => {
  const sortedZindexes = [...indexes]
    .filter(w => w.windowId !== closingWindowId)
    .sort((w1, w2) => w1.zIndex - w2.zIndex);

  sortedZindexes.forEach((zIndex, arrIndex) => zIndex.zIndex = STARTING_WINDOW_COMPONENT_ZINDEX + arrIndex);
  return sortedZindexes;
};