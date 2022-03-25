import { DesktopItem } from '.';

export const ITEM_HEIGHT = 75;
export const ITEM_WIDTH = 60;
export const WIDTH_OFFSET = 10;
export const HEIGHT_OFFSET = 60;

export const getDestopItemNewPositionRelativeToMouse = (event: any, mouseToElementTopOffset: number,
mouseToElementLeftOffset: number) => {

  return {
    left: +event.clientX - mouseToElementLeftOffset,
    top: +event.clientY - mouseToElementTopOffset
  };
};

// Update position to avoid going out of screen
export const correctItemPosition = (top: number, left: number)
: { correctedTop: number, correctedLeft: number } => {

  const maxWidth = document.body.clientWidth - ITEM_WIDTH - WIDTH_OFFSET;
  const maxHeight = window.innerHeight - ITEM_HEIGHT - HEIGHT_OFFSET;

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
  const i1Right = i1.left + ITEM_WIDTH;
  const i2Right = i2.left + ITEM_WIDTH;
  return (i1.left > i2.left && i1.left < i2Right) ||
    (i1Right > i2.left && i1Right < i2Right);
};

const isHeightOverlapping = (i1: { top: number, left: number }, i2: DesktopItem): boolean => {
  const i1Bottom = i1.top + ITEM_HEIGHT;
  const i2Bottom = i2.top + ITEM_HEIGHT;

  return (i1.top > i2.top && i1.top < i2Bottom) ||
    (i1Bottom > i2.top && i1Bottom < i2Bottom);
};