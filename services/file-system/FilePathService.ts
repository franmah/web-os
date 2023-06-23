export const convertPathToFragments = (path: string): string[] => {
    return path
      .split('/')
      .filter(fragment => !!fragment);
};

export const getCurrentFolderOrFileNameInPath = (path: string): string => {
  const pathFragments = convertPathToFragments(path);
  return pathFragments[pathFragments.length - 1];
};