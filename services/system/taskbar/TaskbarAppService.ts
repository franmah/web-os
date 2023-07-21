import { GeneralIconCommand } from '../../../System/context-menu-commands/commands/GeneralIconCommand';
import { GeneralImageCommand } from '../../../System/context-menu-commands/commands/GeneralImageCommand';
import { ProcessDirectory } from '../../../System/process/ProcessDirectory';
import { ProcessDirectoryByExtension } from '../../../System/process/ProcessDirectoryByExtension';
import { ProcessNameEnum } from '../../../System/process/ProcessNameEnum';
import { CONTEXT_MENU_MEDIUM_WIDTH } from '../../../components/system/context-menu/ContextMenu';
import { PRE_TASKBAR_APP_ID } from '../../../components/taskbar-component/TaskbarApps';
import { DRAG_DROP_DATA_TRANSFER_FIELDS, DRAG_DROP_SOURCE } from '../../../constants/DragDrop';
import { IconPaths } from '../../../constants/IconPaths';
import { TASKBAR_HEIGHT } from '../../../constants/Taskbar';
import { TaskbarPinnedAppContextType } from '../../../contexts/TaskbarPinnedAppContext';
import { WindowContextType } from '../../../contexts/WindowContext';
import { FileSystemContextType } from '../../../types/system/file/FileSystemContext';
import { Process, ProcessContextType } from '../../../types/system/processes/Processes';
import { Windows } from '../../../types/system/window-manager/WindowManagerState';
import { TaskbarAppType } from '../../../types/taskbar/TaskbarAppType';
import { getCurrentItemNameInPath, getFileExtension } from '../../file-system/FilePathService';

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

export const openContextMenu = (
  appName: string,
  apps: TaskbarAppType[],
  pinnedAppContext: TaskbarPinnedAppContextType,
  processContext: ProcessContextType
) => {

  const app = apps.find(app => app.name === appName);
  if (!app) {
    console.error(`Error opening context menu for app: ${appName}: app not found`);
    return;
  }

  const pinCommand = app.pinned ?
    new GeneralIconCommand(
      'Unpin from taskbar',
      require('react-icons/tb').TbPinnedOff,
      () => pinnedAppContext.removePinnedAppNames(appName)
    ) :
    new GeneralIconCommand(
      'Pin to taskbar',
      require('react-icons/tb').TbPin,
      () => pinnedAppContext.addPinnedAppNames(appName)
    );

  const commands = [
    new GeneralImageCommand(appName, ProcessDirectory[appName].iconPath || '', () => processContext.openProcess(appName)),
    pinCommand
  ];

  if (app.open) {
    const processId = Object.values(processContext.processes).find(process => process.name === appName)?.processId || '';
    const closeCommmand = app.multipleOpen ?
      new GeneralIconCommand('Close all windows', require('react-icons/gr').GrClose, () => processContext.closeProcessesByName(appName)) :
      new GeneralIconCommand('Close window', require('react-icons/gr').GrClose, () => processContext.closeProcess(processId));
    commands.push(closeCommmand);
  }

  const taskbarAppElement = document.getElementById(PRE_TASKBAR_APP_ID + appName);
  if (!taskbarAppElement) {
    return;
  }

  const elementMiddlewidthFromLeft = taskbarAppElement?.offsetLeft + (taskbarAppElement.offsetWidth / 2);
  const HEIGHT_OFFSET = 20;

  processContext.openProcess(ProcessNameEnum.CONTEXT_MENU, {
    commands,
    left: elementMiddlewidthFromLeft - CONTEXT_MENU_MEDIUM_WIDTH / 2,
    top: window.innerHeight - TASKBAR_HEIGHT - HEIGHT_OFFSET
  });
};

export const handleDragEnd = (result: any, apps: TaskbarAppType[]): TaskbarAppType[] => {
  const startIndex = result?.source?.index;
	const endIndex = result?.destination?.index;

  if (startIndex === undefined || endIndex === undefined) {
    // console.error('Error moving taskbar app: start or end index is null.');
    return apps;
  }

  const draggedApp = {...apps[startIndex]};
  apps.splice(startIndex, 1);
  apps.splice(endIndex, 0, draggedApp);
  return [...apps];
};

export const handleItemDrop = (event: any, fs: FileSystemContextType, pinnedAppContext: TaskbarPinnedAppContextType) => {
		const source = event?.dataTransfer?.getData(DRAG_DROP_DATA_TRANSFER_FIELDS.SOURCE);
		const path = event?.dataTransfer?.getData(DRAG_DROP_DATA_TRANSFER_FIELDS.PATH);

		if (source && source === DRAG_DROP_SOURCE.DESKTOP && path) {
			if (fs.isDirectory(path)){
				pinnedAppContext.addPinnedAppNames(ProcessNameEnum.EXPLORER);
				return;
			}

			const app = ProcessDirectoryByExtension[getFileExtension(getCurrentItemNameInPath(path))];
			pinnedAppContext.addPinnedAppNames(app);
		}
};

export const handleAppClicked = (appName: string, apps: TaskbarAppType[], windowContext: WindowContextType, processContext: ProcessContextType) => {
  const app = apps.find(app => app.name === appName);
  if (!app) {
    console.error(`Error opening app from taskbar: can't find ${appName}.`);
    return;
  }

  if (app.open && app.multipleOpen) {
    // open first available window for that app.
    // TODO: replace by showing preview of open windows.
    const window = Object.entries(windowContext.windows).find(([windowId, window]) => window.process.name === appName);
    if (!window) {
      return;
    }
    windowContext.focusWindow(window[0]);
  } else if (app.open) {
    handleOpenAppClicked(appName, windowContext);
  } else {
    processContext.openProcess(appName);
  }
};

export const handleOpenAppClicked = (appName: string, windowContext: WindowContextType) => {
  const windowToUpdate = Object.entries(windowContext.windows).find(([windowId, { process }]) => process.name === appName);
  if (!windowToUpdate) {
    console.error(`Error opening app from taskbar. can't find window to focus for app ${appName}.`);
    return;
  }

  // If app is unfocused: focus
  // else if minimized: focus
  // eles if focused: minimize
  const windowId = windowToUpdate[0];
  const minimized = windowToUpdate[1].state.minimized;
  const focused = windowToUpdate[1].state.focused;

  if (minimized) {
    windowContext.unminimizeWindow(windowId);
  } else if (focused) {
    windowContext.minimizeWindow(windowId);
  } else {
    windowContext.focusWindow(windowId);
  }
};
