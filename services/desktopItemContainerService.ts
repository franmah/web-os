import { DesktopItem } from '../types/desktop/DesktopItem';
import { ExplorerFile } from '../types/system/file/ExplorerElement';

const DEFAULT_FOLDER_NAME = 'New folder';
const NEW_FOLDER_NAME_REGEX = /New folder \([2-9]+\)/g;
export const DEFAULT_FOLDER_ICON_PATH = '/icons/folder-icon-empty.png';

export const toItemWrappers = (files: ExplorerFile[]): DesktopItem[] => {
  return files?.map(file => ({
      id: file.id,
      iconPath: file.iconPath,
      left: 0,
      name: file.name,
      selected: false,
      top: 0,
      renaming: false
    } as DesktopItem)
  ) || [];
};

/**
 * 
 * @param items 
 * @returns either 'New folder' or 'New folder (x)' where x is the next availble number 
 * (starting from 2)
 */
export const getNewItemName = (items: DesktopItem[]): string => {
  const itemsWithDefaultFolderName = items.filter(i => 
    i.name.includes(DEFAULT_FOLDER_NAME));

  if (itemsWithDefaultFolderName?.length === 0) {
    return DEFAULT_FOLDER_NAME;
  }

  const temp = items.filter(i => !!i.name.match(NEW_FOLDER_NAME_REGEX));

  let i = 0;
  for (; i < temp.length; i++) {
    const num = +temp[i].name?.[12];
    if (i + 2 < num)
      return `${DEFAULT_FOLDER_NAME} (${i + 2})`;
  }

  return `${DEFAULT_FOLDER_NAME} (${i + 2})`;
};