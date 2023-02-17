import { HEIGHT_OFFSET, ITEM_HEIGHT, ITEM_WIDTH, WIDTH_OFFSET } from '../constants/DesktopConsts';
import { TASKBAR_HEIGHT } from '../constants/TaskbarConsts';
import { DesktopItem } from '../types/desktop/DesktopItem';

export const moveItemsOnDesktop = (items: DesktopItem[], itemId: string, startItemTop: number,
startItemLeft: number, newItemTop: number, newItemLeft: number) => {

  const element = items.find(el => el.id === itemId);
  if (!element) {
    return items;
  }

  const updatedItems = items.map(item => {
    if (!item.selected) {
      return { ...item };
    }
    
    const offsetTop = item.top - startItemTop;
    const offsetLeft = item.left - startItemLeft;

    const { correctedLeft, correctedTop } = correctItemPosition(offsetTop + newItemTop, offsetLeft + newItemLeft);

    if (isItemOverlapingOtherItems(item.id, correctedLeft, correctedTop, items)) {
      return { ...item };
    }

    return {
      ...item,
      top: correctedTop,
      left: correctedLeft
    };
  });

  return [...updatedItems];
};

// Update position to avoid going out of screen
const correctItemPosition = (top: number, left: number)
: { correctedTop: number, correctedLeft: number } => {

  const maxWidth = document.body.clientWidth - ITEM_WIDTH - WIDTH_OFFSET;
  const maxHeight = window.innerHeight - ITEM_HEIGHT - TASKBAR_HEIGHT;

  return {
    correctedLeft: Math.min(Math.max(left, WIDTH_OFFSET), maxWidth),
    correctedTop: Math.min(Math.max(top, 0), maxHeight)
  };
};

const isItemOverlapingOtherItems =
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