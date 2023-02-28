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

