import { v4 } from 'uuid';
import { DesktopItem } from '../../../types/desktop/DesktopItem';
import { getFolderIcon, getIconPathByExtension } from '../../IconService';
import { getCurrentItemNameInPath, getFileExtension } from '../../file-system/FilePathService';
import { ExplorerItem } from '../../../types/system/file/ExplorerItem';
import { CreateItemType } from '../../../constants/CreateItemType';

const NEW_FOLDER_NAME_REGEX = (type: CreateItemType) => new RegExp(`New ${type}( \([1-9]+\))?`, 'g');

export const pathToDesktopItem = (path: string, isDirectory: boolean): DesktopItem => {
	const iconPath = isDirectory
		? getFolderIcon(path)
		: getIconPathByExtension(getFileExtension(getCurrentItemNameInPath(path)));

	return {
		fsId: '',
		iconPath,
		id: v4(),
		left: 0,
		path,
		selected: false,
		top: 0
	};
};

export const explorerItemToDesktopItem = (explorerItem: ExplorerItem, path: string, isDirectory: boolean): DesktopItem => {
	const iconPath = isDirectory
		? getFolderIcon(path)
		: getIconPathByExtension(getFileExtension(getCurrentItemNameInPath(path)));

	return {
		fsId: explorerItem.id,
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
export const getNewItemName = (fileType: CreateItemType, extension: string, items: DesktopItem[]): string => {
	const itemsWithDefaultName = items.filter(item => getCurrentItemNameInPath(item.path).includes(fileType));

	if (itemsWithDefaultName?.length === 0) {
		return 'New ' + fileType;
	}

	const matches = items.filter(item => NEW_FOLDER_NAME_REGEX(fileType).test(getCurrentItemNameInPath(item.path)));

	// Default name without a number
	if (!matches.find(item => getCurrentItemNameInPath(item.path) === `New ${fileType}${extension}`)) {
		return `New ${fileType}`;
	}

	const numberStartingIndex = `New ${fileType} (`.length;
	const lastNumberDigit = 2;

	const digits = matches.map(item =>
		+getCurrentItemNameInPath(item.path).substring(numberStartingIndex, numberStartingIndex + lastNumberDigit - 1)
	);

	digits.sort((a, b) => +a > +b ? 1 : -1);

	let i = 2;
	for (; i <= digits[digits.length - 1]; i += 1) {
		if (!digits.includes(i)) {
			return `New ${fileType} (${i})`;
		}
	}

	return `New ${fileType} (${i})`;
};
