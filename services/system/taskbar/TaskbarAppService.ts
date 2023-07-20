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
  const numOpenWindowsPerApp: { [appName: string]: number } = {};
  Object.values(windows)
    .forEach(({ process: { name } }) =>
      numOpenWindowsPerApp[name] ? numOpenWindowsPerApp[name] += 1 : numOpenWindowsPerApp[name] = 1);

  for (const windowId in windows) {
    const appName = windows[windowId].process.name;
    const matchingApp = apps.find(app => app.name === appName);

    if (matchingApp) {
      matchingApp.multipleOpen = numOpenWindowsPerApp[appName] > 1;
      matchingApp.open = true;
      // TODO: add:matchingApp.minimized windows[windowId].state.mini
      matchingApp.focused = windows[windowId].state.focused;
    } else {
      apps.push({
        focused: false,
        iconPath: ProcessDirectory[appName].iconPath || IconPaths.UNKOWN_EXTENSION,
        multipleOpen: numOpenWindowsPerApp[appName] > 1,
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
  const closeApps = apps.map(app => ({ ...app, open: processNames.includes(app.name) }));
  return closeApps.filter(app => app.pinned || processNames.includes(app.name));
};
