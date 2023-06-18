export const pathToFragments = (path: string): string[] => {
    return path
      .split('/')
      .filter(fragment => !!fragment);
};