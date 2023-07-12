import { HEIGHT_OFFSET, ITEM_HEIGHT, ITEM_WIDTH, WIDTH_OFFSET } from '../../../constants/Desktop';
import { TASKBAR_HEIGHT } from '../../../constants/Taskbar';
import { DesktopItem } from '../../../types/desktop/DesktopItem';

export const moveItemsOnDesktop = (
	items: DesktopItem[],
	itemPath: string,
	startItemTop: number,
	startItemLeft: number,
	newItemTop: number,
	newItemLeft: number
) => {
	const element = items.find(el => el.path === itemPath);
	if (!element) {
		return items;
	}

	const itemsToMove = items.filter(i => i.selected);

	const updatedItems = items.map(item => {
		if (!item.selected) {
			return { ...item };
		}

		const offsetTop = item.top - startItemTop;
		const offsetLeft = item.left - startItemLeft;

		const { correctedLeft, correctedTop } = correctItemPosition(offsetTop + newItemTop, offsetLeft + newItemLeft);
		// if (isPositionInvalid(item.id,  correctedTop, correctedLeft, itemsToMove, items)) {
		//   return { ...item };
		// }

		return {
			...item,
			top: correctedTop,
			left: correctedLeft
		};
	});

	return [...updatedItems];
};

// Update position to avoid going out of screen
const correctItemPosition = (top: number, left: number): { correctedTop: number; correctedLeft: number } => {
	const maxWidth = document.body.clientWidth - ITEM_WIDTH - WIDTH_OFFSET;
	const maxHeight = window.innerHeight - ITEM_HEIGHT - TASKBAR_HEIGHT;

	return {
		correctedLeft: Math.min(Math.max(left, WIDTH_OFFSET), maxWidth),
		correctedTop: Math.min(Math.max(top, 0), maxHeight)
	};
};

const isPositionInvalid = (
	itemPath: string,
	top: number,
	left: number,
	itemsMoving: DesktopItem[],
	items: DesktopItem[]
): boolean => {
	return items.some(item => {
		return (
			!itemsMoving.some(i => i.path === item.path) && // Don't check item that are moving.
			item.path !== itemPath &&
			isItemOverlapingOtherItems(top, left, item)
		);
	});
};

const isItemOverlapingOtherItems = (i1Top: number, i1Left: number, i2: DesktopItem) => {
	const i1Right = i1Left + ITEM_WIDTH;
	const i2Right = i2.left + ITEM_WIDTH;
	const i1Bottom = i1Top + ITEM_HEIGHT;
	const i2Bottom = i2.top + ITEM_HEIGHT;

	const left = i1Left < i2Right && i1Left > i2.left;
	const bottom = i1Bottom < i2Bottom && i1Bottom > i2.top;
	const top = i1Top < i2Bottom && i1Top > i2.top;
	const right = i1Right < i2Right && i1Right > i2.left;

	return (left && (bottom || top)) || (right && (bottom || top));
};

// TODO: doesn't work exactly like windows.
// Items in box should be !selected.
// Was unable to implement it because too many events triggered for useState to follow.
export const getSelectedItemsFromSelectionBoxgWithCtrl = (
	currentDesktopItems: DesktopItem[],
	selectedItemPaths: string[],
	previousElementInBox: HTMLElement[]
): DesktopItem[] => {
	const previouslySelectedItemIds = previousElementInBox.map(element => element.id);

	const updatedItems = currentDesktopItems.map(i => {
		let selected = i.selected;

		if (selectedItemPaths.includes(i.path)) {
			selected = true;
		}
		// Unselect item if it was in box but is not anymore.
		else if (previouslySelectedItemIds.includes(i.path)) {
			selected = false;
		}

		return {
			...i,
			selected
		};
	});

	return updatedItems;
};

/**
 * Select items that are between the most top left selected item and the clicked item,
 * from the left of the top item to the right of the bottom item, from top to bottom.
 * @param clickedItemPath
 * @param items
 * @returns
 */
export const selectItemsWithShiftKey = (
	clickedItemPath: string,
	items: DesktopItem[],
	ctrlKey: boolean
): DesktopItem[] => {
	const clickedItem = items.find(i => i.path === clickedItemPath) as DesktopItem;

	if (!clickedItem) {
		throw Error('Select items with shift key: No clicked item.');
	}

	const mostTopLeftSelectedItem = getMostTopLeftSelectedItem(items);

	if (!mostTopLeftSelectedItem) {
		clickedItem.selected = true;
		return items;
	}

	const topItem = mostTopLeftSelectedItem.top < clickedItem.top ? mostTopLeftSelectedItem : clickedItem;
	const bottomItem = topItem.path === clickedItem.path ? mostTopLeftSelectedItem : clickedItem;

	const updatedItems: DesktopItem[] = items.map(item => ({
		...item,
		selected: isItemBetweenSelectedAndClicked(topItem, bottomItem, item) || (ctrlKey && item.selected)
	}));

	return [...updatedItems];
};

const isItemBetweenSelectedAndClicked = (topItem: DesktopItem, bottomItem: DesktopItem, item: DesktopItem): boolean => {
	return (
		(topItem.top < item.top && item.top < bottomItem.top) || // height between both selected and clicked.
		(item.left >= topItem.left && item.top === topItem.top) || // to the right of top item
		(item.left <= bottomItem.left && item.top === bottomItem.top) // to the left of bottom item
	);
};

const getMostTopLeftSelectedItem = (items: DesktopItem[]): DesktopItem | null => {
	const startItem = items.find(i => i.selected);

	if (!startItem) {
		return null;
	}

	return items.reduce((neededItem, item) => {
		if (!item.selected) {
			return neededItem;
		} else if (!neededItem) {
			return item;
		} else if (item.top < neededItem.top) {
			return item;
		} else if (item.top === neededItem.top && item.left < neededItem.left) {
			return item;
		}

		return neededItem;
	}, startItem);
};
