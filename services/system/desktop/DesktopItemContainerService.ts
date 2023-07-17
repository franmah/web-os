import { v4 } from 'uuid';
import { DesktopItem } from '../../../types/desktop/DesktopItem';
import { getFolderIcon, getIconPathByExtension } from '../../IconService';
import { getCurrentItemNameInPath, getFileExtension } from '../../file-system/FilePathService';
import { ExplorerItem } from '../../../types/system/file/ExplorerItem';
import { CreateItemType } from '../../../constants/CreateItemType';
import { CommonFolderPaths } from '../../../constants/system/file-system/CommonFilePaths';
import { SupportedFileExtension } from '../../../constants/SupportedFileExtension';

// eslint-disable-next-line no-useless-escape
const NEW_FOLDER_NAME_REGEX = (type: CreateItemType) => new RegExp(`New ${type}( \([1-9]+\))?`, 'g');

export const setCurrentItemsFromFileItems = (
	fileItems: ExplorerItem[],
	currentItems: DesktopItem[],
	isDirectory: (path: string) => boolean
): DesktopItem[] => {
	const updatedItems: DesktopItem[] = [];

	// Update current items that have been modified
	for (const desktopItem of currentItems) {
		const matchingFileItem = fileItems.find(fileItem => fileItem.id === desktopItem.fsId);
		if (matchingFileItem) {
			const item = {
				fsId: matchingFileItem.id,
				iconPath: getIconPathByExtension(getFileExtension(matchingFileItem.name)),
				id: desktopItem.id,
				left: desktopItem.left,
				path: CommonFolderPaths.DESKTOP + '/' + matchingFileItem.name,
				selected: desktopItem.selected,
				top: desktopItem.top
			};
			updatedItems.push({ ...item });
		}
	}

	// Add new items
	const newItems = fileItems.filter(fileItem => !currentItems.find(desktopItem => fileItem.id === desktopItem.fsId));
	updatedItems.push(...newItems.map(i =>
		explorerItemToDesktopItem(i, CommonFolderPaths.DESKTOP + '/' + i.name, isDirectory(CommonFolderPaths.DESKTOP + '/' + i.name))));

	return updatedItems;
};

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

export const createNewItem = (top: number, left: number, fileType: CreateItemType, currentItems: DesktopItem[]): DesktopItem => {
	const isDirectory = fileType === CreateItemType.FOLDER;
	const newItemName = getNewItemName(fileType, getExtension(fileType), currentItems);
	const path = CommonFolderPaths.DESKTOP + '/' + newItemName;
	const item = pathToDesktopItem(path, isDirectory);
	item.left = left;
	item.top = top;

	return item;
};

/**
 *
 * @param items
 * @returns either 'New folder' or 'New folder (x)' where x is the next availble number
 * (starting from 2)
 */
const getNewItemName = (fileType: CreateItemType, extension: string, items: DesktopItem[]): string => {
	const itemsWithDefaultName = items.filter(item => getCurrentItemNameInPath(item.path).includes(fileType));

	if (itemsWithDefaultName?.length === 0) {
		return 'New ' + fileType + extension;
	}

	const matches = items.filter(item => NEW_FOLDER_NAME_REGEX(fileType).test(getCurrentItemNameInPath(item.path)));

	// Default name without a number
	if (!matches.find(item => getCurrentItemNameInPath(item.path) === `New ${fileType}${extension}`)) {
		return `New ${fileType}${extension}`;
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
			return `New ${fileType} (${i})${extension}`;
		}
	}

	return `New ${fileType} (${i})${extension}`;
};

const getExtension = (fileType: CreateItemType): string => {
	if (fileType === 'folder') return '';
	if (fileType === 'Text Document') return '.' + SupportedFileExtension.TXT;

	return '';
};
