import { DesktopItem } from "../types/desktop/DesktopItem";

export const areItemsTheSame = (item1: DesktopItem, item2: DesktopItem) => {
  if ((!item1 && !!item2) || (!item2 && !!item1)) {
    return false;
  }

  if (!item1 && !item2) {
    return true;
  }

  return (
    item1.iconPath === item2.iconPath &&
    item1.id === item2.id &&
    item1.left === item2.left &&
    item1.name === item2.name &&
    item1.renaming === item2.renaming &&
    item1.selected === item2.selected &&
    item1.top === item2.top
  );
};