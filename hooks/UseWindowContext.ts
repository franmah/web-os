import { useCallback, useContext, useEffect, useState } from 'react';
import { Windows } from '../types/system/window-manager/WindowManagerState';
import { ProcessContext } from '../contexts/ProcessContext';
import * as windowManagerService from '../services/system/window-manager/WindowManagerService';
import { WindowResizeDirection } from '../constants/system/window/WindowResizeDirectionEnum';
import { CustomMaximizeDirection } from '../constants/system/window/CustomMaximizeDirectionEnum';
import { Processes, WindowedProcess, WindowedProcesses } from '../types/system/processes/Processes';
import { isEventOriginatedFromWithinTargetIdSubtree } from '../services/EventService';

export const useWindowContext = () => {

  const { closeProcess, processes } = useContext(ProcessContext);

  const [windows, setWindows] = useState<Windows>({});

	const numWindows = Object.keys(windows).length;

	// Unselect all windows when there is a click outside a window.
	// Reset event listeners when number of windows changes.
	useEffect(() => {
		const unfocusWindowsOnDocumentMouseDown = (event: MouseEvent) => {
			const noWindowComponentClicked = Object.keys(windows).every(
				windowId => !isEventOriginatedFromWithinTargetIdSubtree(event, windowId)
			);

			if (noWindowComponentClicked) {
				setWindows(currentWindows => {
					Object.values(currentWindows).forEach(w => (w.state.focused = false));
					return { ...currentWindows };
				});
			}
		};

		document.addEventListener('mousedown', unfocusWindowsOnDocumentMouseDown, false);
		return () => {
			document.removeEventListener('mousedown', unfocusWindowsOnDocumentMouseDown, false);
		};
	}, [numWindows]);

	// update windows (state) by adding or removing new/old processes
  useEffect(() => {
		setWindows(currentStates => {
      // TODO: move to process context
      const windowedProcesses: WindowedProcesses = {};
      const nonWindowedProceses: Processes = {};
      Object.entries(processes).forEach(([id, process]) => {
		    if (process instanceof WindowedProcess) windowedProcesses[id] = process;
		    else nonWindowedProceses[id] = process;
	    });

			return windowManagerService.updateWindowStatesOnNewProcess(windowedProcesses, currentStates);
		});
	}, [processes]);

  const closeWindow = (windowId: string) => {
		const processId = windows[windowId]?.process?.processId;

		if (!processId) {
			console.error(`Error trying to close window, processId not found (windowId: ${windowId})`);
		} else {
			setWindows(currentWindows => {
				return windowManagerService.handleZindexesUpdateOnCloseWindow(windowId, currentWindows);
			});
			closeProcess(processId);
		}
	};

  const focusWindow = (windowId: string) => {
		setWindows(currentWindows => {
			return windowManagerService.focusWindow(windowId, currentWindows);
		});
	};

  const moveWindow = useCallback((windowId: string, event: MouseEvent) => {
		setWindows(currentWindows => {
			return windowManagerService.updateWindowsOnMouseMove(windowId, currentWindows, event);
		});
	}, []);

  const startMovingWindow = (windowId: string, event: MouseEvent) => {
		setWindows(currentWindows => {
			return windowManagerService.setWindowAsMoving(windowId, currentWindows, event);
		});
	};

  const startResizingWindow = (windowId: string, event: MouseEvent, direction: WindowResizeDirection) => {
		setWindows(currentWindows => {
			return windowManagerService.setWindowAsResizing(windowId, currentWindows, event, direction);
		});
	};

  /**
   * End moving or resizing a window.
   */
	const handleMouseUp = useCallback((windowId: string, event: MouseEvent) => {
		setWindows(currentWindows => {
			return windowManagerService.updateWindowsOnMouseUp(windowId, currentWindows, event);
		});
	}, []);

	const maximizeWindow = (windowId: string) => {
		setWindows(currentWindows => {
			return windowManagerService.updateWindowsOnMaximize(windowId, currentWindows);
		});
	};

	const heightMaximizeWindow = (windowId: string) => {
		setWindows(currentWindows => {
			return windowManagerService.updateWindowOnHeightMaximize(windowId, currentWindows);
		});
	};

	const moveWindowToCustomMaimizeOption = (windowId: string, direction: CustomMaximizeDirection) => {
		setWindows(currentWindows => {
			return windowManagerService.updateWindowOnCustomMaximize(windowId, currentWindows, direction);
		});
	};

	const updateWarnBeforeProcessCloses = (processId: string, warn: boolean) => {
		setWindows(currentWindows => {
			return windowManagerService.updateWindowWarnBeforeProcessCloses(currentWindows, processId, warn);
		});
	};

	const minimizeWindow = (windowId: string) => {
		setWindows(windows => {
			return windowManagerService.minimizeWindow(windowId, windows);
		});
	};

  return {
    closeWindow,
    focusWindow,
    handleMouseUp,
    heightMaximizeWindow,
    maximizeWindow,
		minimizeWindow,
    moveWindow,
    moveWindowToCustomMaimizeOption,
    startMovingWindow,
    startResizingWindow,
    updateWarnBeforeProcessCloses,
    windows
  };
};
