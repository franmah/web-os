import { HEIGHT_OFFSET, ITEM_HEIGHT, ITEM_WIDTH, WIDTH_OFFSET } from '../../../constants/Desktop';
import { TASKBAR_HEIGHT } from '../../../constants/Taskbar';
import { DesktopItem } from '../../../types/desktop/DesktopItem';
import { getCurrentItemNameInPath } from '../../file-system/FilePathService';
import { areItemsOverlaping } from './DesktopItemContainerUiHelperService';

export enum DesktopSortOptions {
	name,
	default
}

export const setItemPositions = (items: DesktopItem[], sortOption: DesktopSortOptions): DesktopItem[] => {
	switch (sortOption) {
		case DesktopSortOptions.name:
			return setItemPositionsByName(items);
		default:
			return setItemDefaultPositions(items);
	}
};

const setItemPositionsByName = (items: DesktopItem[]): DesktopItem[] => {
	const sortedItems = items.sort((i1, i2) => (i1.path > i2.path ? 1 : 0));
	return setItemDefaultPositions(sortedItems);
};

const setItemDefaultPositions = (items: DesktopItem[]): DesktopItem[] => {
	const numElementsMaxPerColumn = Math.floor((window.innerHeight - TASKBAR_HEIGHT) / (ITEM_HEIGHT + HEIGHT_OFFSET));

	let currentColumn = 0;
	let currentRow = 0;

	const positionedItems: DesktopItem[] = [];
	const nonPositionedItems: DesktopItem[] = [];

	for (const item of items) {
		if (item.left === 0 && item.top === 0) {
			nonPositionedItems.push(item);
		} else {
			positionedItems.push(item);
		}
	}

	const index = 0;
	for (const item of nonPositionedItems) {
		if (index % numElementsMaxPerColumn === 0 && index !== 0) {
			currentColumn += 1;
			currentRow = 0;
		}

		while (true) {
			item.left = currentColumn * (ITEM_WIDTH + WIDTH_OFFSET);
			item.top = HEIGHT_OFFSET + (currentRow * ITEM_HEIGHT + currentRow * HEIGHT_OFFSET);
			currentRow += 1;
			const isValidPosition = positionedItems.every(
				positionedItem => !areItemsOverlaping(item.top, item.left, positionedItem)
			);

			if (isValidPosition) {
				break;
			}
		}

		positionedItems.push(item);
	}
	return positionedItems;
};
