import { useContext, useState } from 'react';
import { CommonFolderPaths } from '../constants/system/file-system/CommonFilePaths';
import { FileSystemContext } from '../contexts/FileSystemContext';

export const QUICK_ACCESS_STATE_DEFAULT = [
	CommonFolderPaths.DESKTOP,
	CommonFolderPaths.DOCUMENTS,
	CommonFolderPaths.DOWNLOADS,
	CommonFolderPaths.PICTURES,
	CommonFolderPaths.MUSIC,
	CommonFolderPaths.VIDEOS
];

export const useExplorerQuickAccessContextState = () => {

	const { isDirectory } = useContext(FileSystemContext);

	const [quickAccessPaths, setQuickAccessPaths] = useState<string[]>(QUICK_ACCESS_STATE_DEFAULT);

	const pinToQuickAccess = (path: string) => {
		if (!isDirectory(path)) {
			console.error('Unable to pin non directory items.');
			return;
		}

		setQuickAccessPaths(paths => {
			const alreadyPinned = paths.find(p => p === path);
			return alreadyPinned ? paths : [...paths, path];
		});
	};

	const unpinFromQuickAccess = (path: string) => {
		setQuickAccessPaths(paths => [...paths.filter(p => p !== path)]);
	};

	const getQuickAccessPaths = () => quickAccessPaths;

	return {
		pinToQuickAccess,
		unpinFromQuickAccess,
		getQuickAccessPaths
	};
};
