import { v4 } from 'uuid';
import { DesktopItem } from '../../../types/desktop/DesktopItem';
import { getFolderIcon, getIconPathByExtension } from '../../IconService';
import { getCurrentItemNameInPath, getFileExtension } from '../../file-system/FilePathService';

const DEFAULT_FOLDER_NAME = 'New folder';
const NEW_FOLDER_NAME_REGEX = (type: string) => new RegExp(`New ${type} \([2-9]+\)`, 'g');
export const DEFAULT_FOLDER_ICON_PATH = '/icons/folder-icon-empty.png';

export const pathToDesktopItem = (path: string, isDirectory: boolean): DesktopItem => {
	const iconPath = isDirectory
		? getFolderIcon(path)
		: getIconPathByExtension(getFileExtension(getCurrentItemNameInPath(path)));

	return {
		iconPath,
		id: v4(),
		left: 0,
		path,
		selected: false,
		top: 0
	};
};

/**
 *
 * @param items
 * @returns either 'New folder' or 'New folder (x)' where x is the next availble number
 * (starting from 2)
 */
export const getNewItemName = (fileType: string, items: DesktopItem[]): string => {
	const itemsWithDefaultFolderName = items.filter(i => getCurrentItemNameInPath(i.path).includes(fileType));

	if (itemsWithDefaultFolderName?.length === 0) {
		return 'New ' + fileType;
	}

	const temp = items.filter(i => !!getCurrentItemNameInPath(i.path).match(NEW_FOLDER_NAME_REGEX(fileType)));

	let i = 0;
	for (; i < temp.length; i += 1) {
		const num = +getCurrentItemNameInPath(temp[i].path)?.[12];
		if (i + 2 < num) return `${fileType} (${i + 2})`;
	}

	return `${fileType} (${i + 2})`;
};
