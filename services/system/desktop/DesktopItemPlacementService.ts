import { HEIGHT_OFFSET, ITEM_HEIGHT, ITEM_WIDTH, WIDTH_OFFSET } from '../../../constants/Desktop';
import { TASKBAR_HEIGHT } from '../../../constants/Taskbar';
import { DesktopItem } from '../../../types/desktop/DesktopItem';

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

	const updatedItems = items.map((item, index) => {
		if (index % numElementsMaxPerColumn === 0 && index !== 0) {
			currentColumn += 1;
			currentRow = 0;
		}

		item.left = currentColumn * (ITEM_WIDTH + WIDTH_OFFSET);
		item.top = HEIGHT_OFFSET + (currentRow * ITEM_HEIGHT + currentRow * HEIGHT_OFFSET);

		currentRow += 1;
		return item;
	});

	return updatedItems;
};
