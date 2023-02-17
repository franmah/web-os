import { HEIGHT_OFFSET, ITEM_HEIGHT, ITEM_WIDTH, WIDTH_OFFSET } from '../constants/DesktopConsts';
import { TASKBAR_HEIGHT } from '../constants/TaskbarConsts';
import { DesktopItem } from '../types/desktop/DesktopItem';
import { ExplorerFile } from '../types/ExplorerElement';

export const toItemWrappers = (files: ExplorerFile[]): DesktopItem[] => {
  return files?.map(file => ({
      id: file.id,
      iconPath: file.iconPath,
      left: 0,
      name: file.name,
      selected: false,
      top: 0
    } as DesktopItem)
  ) || [];
};

export const placeItemsAtStartPosition = (items: DesktopItem[]) => {
  const numElementsMaxPerColumn = Math.floor(
    (window.innerHeight - TASKBAR_HEIGHT) /
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