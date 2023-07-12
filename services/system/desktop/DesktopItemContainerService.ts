import { DesktopItem } from '../../../types/desktop/DesktopItem';
import { getCurrentItemNameInPath } from '../../file-system/FilePathService';

const DEFAULT_FOLDER_NAME = 'New folder';
const NEW_FOLDER_NAME_REGEX = (type: string) => new RegExp(`New ${type} \([2-9]+\)`, 'g');
export const DEFAULT_FOLDER_ICON_PATH = '/icons/folder-icon-empty.png';

export const toItemWrappers = (paths: string[]): DesktopItem[] => {
	return (
		paths?.map(
			path =>
				({
					left: 0,
					path,
					renaming: false,
					selected: false,
					top: 0
				}) as DesktopItem
		) || []
	);
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
	for (; i < temp.length; i++) {
		const num = +getCurrentItemNameInPath(temp[i].path)?.[12];
		if (i + 2 < num) return `${fileType} (${i + 2})`;
	}

	return `${fileType} (${i + 2})`;
};
