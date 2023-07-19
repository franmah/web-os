import { ProcessDirectory } from '../../../System/process/ProcessDirectory';
import { TaskbarAppType } from '../../../components/taskbar-component/TaskbarApps';
import { IconPaths } from '../../../constants/IconPaths';
import { Processes } from '../../../types/system/processes/Processes';

export const mergePinnedAppsToApps = (apps: TaskbarAppType[], pinnedAppNames: string[]): TaskbarAppType[] => {
  for (const pinnedAppName of pinnedAppNames) {
    const matchingApp = apps.find(app => app.name === pinnedAppName);
    if (matchingApp) {
      matchingApp.pinned = true;
    } else {
      apps.push({
        focused: false,
        iconPath: ProcessDirectory[pinnedAppName].iconPath || IconPaths.UNKOWN_EXTENSION,
        multipleOpen: false,
        name: pinnedAppName,
        open: false,
        pinned: true
      });
    }
  }

  return [...apps];
};

export const mergeOpenProcessToApps = (apps: TaskbarAppType[], processes: Processes): TaskbarAppType[] => {
  const userProcesses = Object
    .values(processes)
    .filter(process => ProcessDirectory[process.name].owner === 'USER');

  const processCount: { [processName: string]: number } = {};
	userProcesses.forEach(({ name }) => processCount[name] ? processCount[name] += 1 : processCount[name] = 1 );

  for (const process of userProcesses) {
  const matchingApp = apps.find(app => app.name === process.name);
    if (matchingApp) {
      matchingApp.multipleOpen = processCount[process.name] > 1;
    } else {
      apps.push({
        focused: false,
        iconPath: ProcessDirectory[process.name].iconPath || IconPaths.UNKOWN_EXTENSION,
        multipleOpen: false,
        name: process.name,
        open: true,
        pinned: true
      });
    }
  }

  return [...apps];
};
