import { CommonFolderPaths } from "../constants/system/file-system/CommonFilePaths";

export const getFolderIcon = (path: string) => {
    switch (path) {
      case CommonFolderPaths.ROOT:
        return '/icons/win11_home.png';
      case CommonFolderPaths.DESKTOP:
        return '/icons/win11_desktop.png';
      case CommonFolderPaths.DOCUMENTS:
        return '/icons/win11_documents.png';
      case CommonFolderPaths.DOWNLOADS:
        return '/icons/win11_downloads.png';
      case CommonFolderPaths.PICTURES:
        return '/icons/win11_pictures.png';
      case CommonFolderPaths.MUSIC:
        return '/icons/win11_music.png';
      case CommonFolderPaths.VIDEOS:
        return '/icons/win11_videos.png';
      default:
        return '/icons/folder-icon.png';
    }
};