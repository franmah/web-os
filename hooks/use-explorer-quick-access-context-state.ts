import { useState } from "react";

export const QUICK_ACCESS_STATE_DEFAULT = [
  '/Desktop',
  '/Documents',
  '/Desktop/New folder (3)'
];

export const useExplorerQuickAccessContextState = () => {

  const [quickAccessPaths, setQuickAccessPaths] = useState<string[]>(QUICK_ACCESS_STATE_DEFAULT);

  const pinToQuickAccess = (path: string) => {
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