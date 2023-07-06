import { CommonFolderPaths } from "../../constants/system/file-system/CommonFilePaths";

export const convertPathToFragments = (path: string): string[] => {
    return path
      .split('/')
      .filter(fragment => !!fragment);
};

export const getCurrentItemNameInPath = (path: string): string => {
  const pathFragments = convertPathToFragments(path);
  return pathFragments[pathFragments.length - 1];
};

export const getParentPath = (path: string): string => {
  if (path === CommonFolderPaths.ROOT)
    return CommonFolderPaths.ROOT;

  const pathFragments = convertPathToFragments(path);
  const pathArr = pathFragments.slice(0, pathFragments.length - 1);
  return '/' + pathArr.join('/') || '/';
};