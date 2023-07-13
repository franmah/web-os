import { IconPaths } from '../constants/IconPaths';
import { SupportedFileExtension } from '../constants/SupportedFileExtension';
import { CommonFolderPaths } from '../constants/system/file-system/CommonFilePaths';

export const getFolderIcon = (path: string) => {
	switch (path) {
		case CommonFolderPaths.ROOT:
			return IconPaths.HOME_FOLDER;
		case CommonFolderPaths.DESKTOP:
			return IconPaths.DESKTOP_FOLDER;
		case CommonFolderPaths.DOCUMENTS:
			return IconPaths.DOCUMENTS_FOLDER;
		case CommonFolderPaths.DOWNLOADS:
			return IconPaths.DOWNLOADS_FOLDER;
		case CommonFolderPaths.PICTURES:
			return IconPaths.PICTURES_FOLDER;
		case CommonFolderPaths.MUSIC:
			return IconPaths.MUSIC_FOLDER;
		case CommonFolderPaths.VIDEOS:
			return IconPaths.VIDEOS_FOLDER;
		default:
			return IconPaths.FOLDER;
	}
};

export const getIconPathByExtension = (extension: string): string => {
	switch (extension) {
		case SupportedFileExtension.TXT:
			return IconPaths.TEXT;
		case SupportedFileExtension.YOUTUBE:
			return IconPaths.YOUTUBE;
		case '': // TODO: remove
			return IconPaths.FOLDER;
		default:
			return IconPaths.UNKOWN_EXTENSION;
	}
};
