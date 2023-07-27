import { CommonFolderPaths } from '../../constants/system/file-system/CommonFilePaths';

export const convertPathToFragments = (path: string): string[] => {
	return path.split('/').filter(fragment => !!fragment);
};

export const getCurrentItemNameInPath = (path: string): string => {
	const pathFragments = convertPathToFragments(path);
	return pathFragments[pathFragments.length - 1];
};

// Returns parent path without '/' at the end
export const getParentPath = (path: string): string => {
	if (path === CommonFolderPaths.ROOT) return '';

	const pathFragments = convertPathToFragments(path);
	const pathArr = pathFragments.slice(0, pathFragments.length - 1);
	return '/' + pathArr.join('/') || CommonFolderPaths.ROOT;
};

export const getFileExtension = (fileName: string): string => {
	if (!fileName.includes('.')) {
		return '';
	}

	const fragments = fileName.split('.');
	return fragments.at(-1) || '';
};

export const isNewItemNameValid = (oldPath: string, newPath: string, isDirectory: boolean): boolean => {
	const extension = getFileExtension(getCurrentItemNameInPath(newPath));

	if (extension && isDirectory) {
		console.error('Directory can\'t have extensions.');
		return false;
	}

	if (!extension && !isDirectory) {
		console.error('Non directory files must have an extension.');
		return false;
	}

	return true;
};

// TODO remove once bug is fixed.
export const removeDoubleSlashes = (path: string): string => {
	let temp = '';
		for (let i = 0; i < path.length; i += 1) {
			if (path[i] === '/' && path?.[i-1] === '/')
				continue;
			temp += path[i];
		}
	return temp;
};
