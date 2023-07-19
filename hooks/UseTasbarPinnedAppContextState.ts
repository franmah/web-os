import { useState } from 'react';

export const useTaskbarPinnedAppContextState = () => {
  const [pinnedAppNames, setPinnedAppNames] = useState<string[]>([]);

  const addPinnedAppNames = (...appNames: string[]) => {
    setPinnedAppNames(currentPinnedApps => {
      const noDoublons = appNames.filter(name => !currentPinnedApps.includes(name));
      return [...currentPinnedApps, ...noDoublons];
    });
  };

  const removePinnedAppNames = (...appNames: string[]) => {
    setPinnedAppNames(currentPinnedApps => {
      return [...currentPinnedApps.filter(name => !appNames.includes(name))];
    });
  };

  return {
    addPinnedAppNames,
    pinnedAppNames,
    removePinnedAppNames
  };
};
