import { DesktopItem } from '../../../types/desktop/DesktopItem';
import { ExplorerFile } from '../../../types/ExplorerElement';

// TODO: MOVE TO CONSTS FILE
export const ITEM_HEIGHT = 80;
export const MAX_ITEM_HEIGHT = 130;
export const ITEM_WIDTH = 60;
export const WIDTH_OFFSET = 10;
export const HEIGHT_OFFSET = 20;
export const TASKBAR_HEIGHT_OFFSET = 60;

// Update position to avoid going out of screen
export const correctItemPosition = (top: number, left: number)
: { correctedTop: number, correctedLeft: number } => {

  const maxWidth = document.body.clientWidth - ITEM_WIDTH - WIDTH_OFFSET;
  const maxHeight = window.innerHeight - ITEM_HEIGHT - TASKBAR_HEIGHT_OFFSET;

  return {
    correctedLeft: Math.min(Math.max(left, WIDTH_OFFSET), maxWidth),
    correctedTop: Math.min(Math.max(top, 0), maxHeight)
  };
};

export const isItemOverlapingOtherItems =
(itemId: string, top: number, left: number, items: DesktopItem[]): boolean => {

   return items.some(item => {
    return item.name !== itemId && isWidthOverlapping({ left, top }, item) &&
     isHeightOverlapping({ left, top }, item);
  });
};

const isWidthOverlapping = (i1: { top: number, left: number }, i2: DesktopItem): boolean => {
  const i1Right = i1.left + ITEM_WIDTH + WIDTH_OFFSET;
  const i2Right = i2.left + ITEM_WIDTH + WIDTH_OFFSET;
  return (i1.left > i2.left && i1.left < i2Right) ||
    (i1Right > i2.left && i1Right < i2Right);
};

const isHeightOverlapping = (i1: { top: number, left: number }, i2: DesktopItem): boolean => {
  const i1Bottom = i1.top + ITEM_HEIGHT + HEIGHT_OFFSET;
  const i2Bottom = i2.top + ITEM_HEIGHT + HEIGHT_OFFSET;

  return (i1.top > i2.top && i1.top < i2Bottom) ||
    (i1Bottom > i2.top && i1Bottom < i2Bottom);
};

export const toItemWrappers = (files: ExplorerFile[]): DesktopItem[] => {
  return files.map(file => {
    return {
      iconPath: file.iconPath,
      left: 0,
      name: file.name,
      selected: false,
      top: 0
    };
  });
};

export const placeItemsAtStartPosition = (items: DesktopItem[]) => {
  const numElementsMaxPerColumn = Math.floor(
    (window.innerHeight - TASKBAR_HEIGHT_OFFSET) /
    (ITEM_HEIGHT + HEIGHT_OFFSET)
  );

  let currentColumn = 0;
  let currentRow = 0;

  items.forEach((item, index) => {
    if (index % numElementsMaxPerColumn === 0 && index !== 0) {
      currentColumn += 1;
      currentRow = 0;
    }

    item.left = currentColumn * (ITEM_WIDTH + WIDTH_OFFSET);
    item.top = HEIGHT_OFFSET + (currentRow * ITEM_HEIGHT + currentRow * HEIGHT_OFFSET);

    currentRow += 1;
    return item;
  });
};

export const getItemsToSelect = (items: DesktopItem[], top: number, bottom: number, left: number, 
right: number): DesktopItem[] => {

  return items.filter(i => {
    const itemTop = i.top;
    const itemBottom = i.top + ITEM_HEIGHT;
    const itemLeft = i.left;
    const itemRight = i.left + ITEM_WIDTH
    
    return (
      isItemInBox(itemTop, itemBottom, itemLeft, itemRight, top, left, right, bottom) || 
      isBoxOverItem(itemTop, itemBottom, itemLeft, itemRight, top, left, right, bottom)
    );
  });
}

const isItemInBox = (itemTop: number, itemBottom: number, itemLeft: number, itemRight: number, 
top: number, left: number, right: number, bottom: number) => {
  return (
    (top < itemTop && itemTop < bottom) ||
    (top < itemBottom && itemBottom < bottom)
      ) && (
    (left < itemLeft && itemLeft < right) ||
    (left < itemRight && itemRight < right)
    );
}

const isBoxOverItem = (itemTop: number, itemBottom: number, itemLeft: number, itemRight: number, 
top: number, left: number, right: number, bottom: number) => {
    return (
      (itemLeft < left && itemLeft < right) &&
      (itemRight > right && itemRight > left) &&
      ((top < itemTop && itemTop < bottom) ||
      (top < itemBottom && itemBottom < bottom))
        ) || (
      (itemTop < top && itemTop < bottom) &&
      (itemBottom > top && itemBottom > bottom) &&
      ((left < itemLeft && itemLeft < right) ||
      (left < itemRight && itemRight < right))
    );
  }