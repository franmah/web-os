import { HEIGHT_OFFSET, ITEM_HEIGHT, ITEM_WIDTH, WIDTH_OFFSET } from '../constants/DesktopConsts';
import { TASKBAR_HEIGHT } from '../constants/TaskbarConsts';
import { DesktopItem } from '../types/desktop/DesktopItem';

export const moveItemsOnDesktop = (items: DesktopItem[], itemId: string, startItemTop: number,
startItemLeft: number, newItemTop: number, newItemLeft: number) => {

  const element = items.find(el => el.id === itemId);
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
    if (checkItemPosition(item.id,  correctedTop, correctedLeft, itemsToMove, items)) {
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

const checkItemPosition = (itemId: string, top: number, left: number, itemsMoving: DesktopItem[], items: DesktopItem[]): boolean => {
   return items.some(item => {
    return (
      !itemsMoving.some(i => i.id === item.id) && // Don't check item that are moving.
      item.id !== itemId &&
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

  return (
    (left && (bottom || top)) ||
    (right && (bottom || top))    
  );
}