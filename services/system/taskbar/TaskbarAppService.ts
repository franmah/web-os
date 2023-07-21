import { ProcessDirectory } from '../../../System/process/ProcessDirectory';
import { TaskbarAppType } from '../../../components/taskbar-component/TaskbarApps';
import { IconPaths } from '../../../constants/IconPaths';
import { Process } from '../../../types/system/processes/Processes';
import { Windows } from '../../../types/system/window-manager/WindowManagerState';

export const mergePinnedAppsToApps = (apps: TaskbarAppType[], pinnedAppNames: string[]): TaskbarAppType[] => {
  // remove apps that are not pinned anymore
  const updatedApps = apps.filter(app => app.pinned && pinnedAppNames.includes(app.name));

  // Add pinned apps
  for (const pinnedAppName of pinnedAppNames) {
    const matchingApp = updatedApps.find(app => app.name === pinnedAppName);

    if (matchingApp) {
      matchingApp.pinned = true;
    } else {
      updatedApps.push({
        focused: false,
        iconPath: ProcessDirectory[pinnedAppName].iconPath || IconPaths.UNKOWN_EXTENSION,
        multipleOpen: false,
        name: pinnedAppName,
        open: false,
        pinned: true
      });
    }
  }

  return [...updatedApps];
};

export const mergeOpenProcessToApps = (apps: TaskbarAppType[], windows: Windows): TaskbarAppType[] => {
  const openWindowsPerApp: { [appName: string]: { number: number, focused: boolean }} = {};
  Object.values(windows)
    .forEach(window => {
      const openWindowInfo = openWindowsPerApp[window.process.name];
      if (openWindowInfo) {
        openWindowInfo.number += 1;
        openWindowInfo.focused = openWindowInfo.focused || window.state.focused;
      } else {
        openWindowsPerApp[window.process.name] = {
          focused: window.state.focused,
          number: 1
        };
      }
    });

  for (const windowId in windows) {
    const appName = windows[windowId].process.name;
    const matchingApp = apps.find(app => app.name === appName);

    if (matchingApp) {
      matchingApp.multipleOpen = openWindowsPerApp[appName].number > 1;
      matchingApp.open = true;
      matchingApp.focused = openWindowsPerApp[appName].focused;
    } else {
      apps.push({
        focused: windows[windowId].state.focused,
        iconPath: ProcessDirectory[appName].iconPath || IconPaths.UNKOWN_EXTENSION,
        multipleOpen: openWindowsPerApp[appName].number > 1,
        name: appName,
        open: true,
        pinned: false
      });
    }
  }

  const userProcesses = Object.values(windows).map(({ process }) => process);
  const updatedApps = removeClosedProcesses(apps, userProcesses);

  return [...updatedApps];
};

/**
 *
 * @param apps
 * @param openProcessNames open processes with already filtered out processes not supposed to show in the taskbar.
 * @returns TaskbarAppType array without processes that were closed (keep pinned apps)
 */
const removeClosedProcesses = (apps: TaskbarAppType[], openProcesses: Process[]): TaskbarAppType[] => {
  const processNames = openProcesses.map(process => process.name);
  const closeApps = apps.map(app => ({
    ...app,
    focused: !processNames.includes(app.name) ? false : app.focused,
    open: processNames.includes(app.name)
  }));
  return closeApps.filter(app => app.pinned || processNames.includes(app.name));
};
