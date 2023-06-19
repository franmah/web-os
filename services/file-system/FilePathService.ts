export const pathToFragments = (path: string): string[] => {
    return path
      .split('/')
      .filter(fragment => !!fragment);
};

export const getCurrentFolderOrFileNameInPath = (path: string): string => {
  const pathFragments = pathToFragments(path);
  return pathFragments[pathFragments.length - 1];
}