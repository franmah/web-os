import { NEW_WINDOW_COMPONENT_ZINDEX_OFFSET, STARTING_WINDOW_COMPONENT_ZINDEX } from "../../../constants/Zindex";
import { WindowManagerZindex } from "./WindowManagerService";

/**
 * Zindex go in increase by NEW_WINDOW_COMPONENT_ZINDEX_OFFSET.
 * @param numWindowedProcesses 
 * @returns 
 */
export const getStartingZindex = (numWindowedProcesses: number): number => {
  return STARTING_WINDOW_COMPONENT_ZINDEX + (numWindowedProcesses * NEW_WINDOW_COMPONENT_ZINDEX_OFFSET);
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
  
  const focusedWindowZindex = sortedIndexes.find(index => index.windowId === clickedWindowId);
  if (!focusedWindowZindex || !focusedWindowZindex.zIndex) {
    console.error(`Error updating windows Zindexes: window ${clickedWindowId} not found.`);
    return indexes;
  }

  // Update every index that is higher than the focus' window old index to be lower.
  sortedIndexes.forEach(i => {
    i.zIndex = i.zIndex > focusedWindowZindex.zIndex ?
      i.zIndex - NEW_WINDOW_COMPONENT_ZINDEX_OFFSET :
      i.zIndex;
  });

  focusedWindowZindex.zIndex = STARTING_WINDOW_COMPONENT_ZINDEX + (indexes.length - 1) * NEW_WINDOW_COMPONENT_ZINDEX_OFFSET;
  
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

  sortedZindexes.forEach((zIndex, arrIndex) => zIndex.zIndex = STARTING_WINDOW_COMPONENT_ZINDEX + (arrIndex * NEW_WINDOW_COMPONENT_ZINDEX_OFFSET));
  return sortedZindexes;
};