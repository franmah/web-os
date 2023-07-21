import { zIndexConsts } from '../../../constants/Zindex';
import { WindowManagerZindex } from './WindowManagerService';

/**
 * Zindex go in increase by NEW_WINDOW_COMPONENT_ZINDEX_OFFSET.
 * @param numWindowedProcesses
 * @returns
 */
export const getStartingZindex = (numWindowedProcesses: number): number => {
	return (
		zIndexConsts.windowComponent.startingWindowComponentZindex +
		numWindowedProcesses * zIndexConsts.windowComponent.newWindowComponentZindexOffset
	);
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
export const updateZindexesOnWindowClicked = (
	indexes: WindowManagerZindex[],
	clickedWindowId: string
): WindowManagerZindex[] => {
	const sortedIndexes = [...indexes].sort((w1, w2) => w1.zIndex - w2.zIndex);

	const focusedWindowZindex = sortedIndexes.find(index => index.windowId === clickedWindowId);
	if (!focusedWindowZindex || !focusedWindowZindex.zIndex) {
		console.error(`Error updating windows Zindexes: window ${clickedWindowId} not found.`);
		return indexes;
	}

	// Update every index that is higher than the focus' window old index to be lower.
	sortedIndexes.forEach(i => {
		i.zIndex =
			i.zIndex > focusedWindowZindex.zIndex
				? i.zIndex - zIndexConsts.windowComponent.newWindowComponentZindexOffset
				: i.zIndex;
	});

	focusedWindowZindex.zIndex =
		zIndexConsts.windowComponent.startingWindowComponentZindex +
		(indexes.length - 1) * zIndexConsts.windowComponent.newWindowComponentZindexOffset;

	return sortedIndexes;
};

/**
 * @param indexes array of WindowManagerZindex before the window is closed.
 * @returns
 */
export const updateZindexesOnWindowCloses = (
	indexes: WindowManagerZindex[],
	closingWindowId: string
): WindowManagerZindex[] => {
	const sortedZindexes = [...indexes]
		.filter(w => w.windowId !== closingWindowId)
		.sort((w1, w2) => w1.zIndex - w2.zIndex);

	sortedZindexes.forEach(
		(zIndex, arrIndex) =>
			(zIndex.zIndex =
				zIndexConsts.windowComponent.startingWindowComponentZindex +
				arrIndex * zIndexConsts.windowComponent.newWindowComponentZindexOffset)
	);
	return sortedZindexes;
};
