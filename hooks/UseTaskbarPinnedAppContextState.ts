import { useState } from 'react';
import { ProcessNameEnum } from '../System/process/ProcessNameEnum';

const STARTING_PINNED_PROCESSES = [
  ProcessNameEnum.EXPLORER,
  ProcessNameEnum.SUN_TEXT_EDITOR
];

export const useTaskbarPinnedAppContextState = () => {
  const [pinnedAppNames, setPinnedAppNames] = useState<string[]>(STARTING_PINNED_PROCESSES);

  const addPinnedAppNames = (...appNames: string[]) => {
    // TODO: Add support to pin apps
    const filteredApps = appNames.filter(name => !(name === ProcessNameEnum.DOOM || name === ProcessNameEnum.SIM_CITY_2000 || !name));
    setPinnedAppNames(currentPinnedApps => {
      const appNamesNoDuplicate = filteredApps.filter(name => !currentPinnedApps.includes(name));
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
