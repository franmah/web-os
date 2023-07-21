import { useState } from 'react';
import { ProcessNameEnum } from '../System/process/ProcessNameEnum';

const STARTING_PINNED_PROCESSES = [
  ProcessNameEnum.EXPLORER,
  ProcessNameEnum.SUN_TEXT_EDITOR,
  ProcessNameEnum.YOUTUBE
];

export const useTaskbarPinnedAppContextState = () => {
  const [pinnedAppNames, setPinnedAppNames] = useState<string[]>(STARTING_PINNED_PROCESSES);

  const addPinnedAppNames = (...appNames: string[]) => {
    setPinnedAppNames(currentPinnedApps => {
      const appNamesNoDuplicate = appNames.filter(name => !currentPinnedApps.includes(name));
      return [...currentPinnedApps, ...appNamesNoDuplicate];
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
