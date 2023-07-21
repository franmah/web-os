import { WINDOW_STARTING_POSITION_OFFSET_PX } from '../../../constants/system/window-manager/WindowManager';
import { CustomMaximizeDirection } from '../../../constants/system/window/CustomMaximizeDirectionEnum';
import { DEFAULT_WINDOW_STATE } from '../../../constants/system/window/Window';
import { WindowMaximize } from '../../../constants/system/window/WindowMaximizeEnum';
import { WindowResizeDirection } from '../../../constants/system/window/WindowResizeDirectionEnum';
import { WindowedProcesses } from '../../../types/system/processes/Processes';
import { Windows } from '../../../types/system/window-manager/WindowManagerState';
import { WindowState } from '../../../types/system/window/WindowState';
import { heightMaximizeWindow, maximizeOrRestoreWindow } from '../window/MaximizeRestoreWindowService';
import { moveWindow } from '../window/MoveWindowService';
import { getWindowStateForCustomMaximize } from '../window/WindowCustomMaximizeOptionService.ts';
import { resizeWindow } from '../window/WindowResizeService';
import { stopMovingAndResizingWindow } from '../window/WindowService';
import { getStartingZindex, updateZindexesOnWindowClicked, updateZindexesOnWindowCloses } from './WindowZindexService';

export const updateWindowStatesOnNewProcess = (
	processes: WindowedProcesses,
	currentStates: Windows
): Windows => {
	const hasNewProcess = Object.keys(processes).length > Object.keys(currentStates).length;
	const windowStates: Windows = {};

	for (const processId in processes) {
		const process = processes[processId];
		const windowId = process.windowParams.windowId;
		const isNewProcess = !currentStates[windowId];

		const state: WindowState = isNewProcess
			? {
					...DEFAULT_WINDOW_STATE,
					...getWindowStartingPosition(Object.values(windowStates).map(ws => ws.state)),
					zIndex: getStartingZindex(Object.keys(windowStates).length)
			  }
			: {
					...currentStates[windowId].state,
					focused: hasNewProcess ? false : currentStates[windowId].state.focused // Unfocus previous windows if there is a new one
			  };

		windowStates[windowId] = {
			process,
			state,
			warnBeforeClosing: false
		};
	}

	return windowStates;
};

// TODO: not 100% correct because runs only one pass.
const getWindowStartingPosition = (currentWindows: WindowState[]): { top: number; left: number } => {
	let startingTop = DEFAULT_WINDOW_STATE.top;
	let startingLeft = DEFAULT_WINDOW_STATE.left;

	for (const { top, left } of currentWindows) {
		if (startingLeft === left && startingTop === top) {
			startingTop += WINDOW_STARTING_POSITION_OFFSET_PX;
			startingLeft += WINDOW_STARTING_POSITION_OFFSET_PX;
		}
	}

	return {
		left: startingLeft,
		top: startingTop
	};
};

export type WindowManagerZindex = {
	windowId: string;
	zIndex: number;
};

export const handleZindexesUpdateOnCloseWindow = (
	windowId: string,
	windows: Windows
): Windows => {
	const currentZindexes: WindowManagerZindex[] = Object.entries(windows).map(([windowId, { state }]) => ({
		windowId,
		zIndex: state.zIndex
	}));
	const updatedZindexes = updateZindexesOnWindowCloses(currentZindexes, windowId);

	for (const updatedZindex of updatedZindexes) {
		windows[updatedZindex.windowId].state.zIndex = updatedZindex.zIndex;
	}

	return { ...windows };
};

export const focusWindow = (clickedWindowId: string, windows: Windows): Windows => {
	const updatedWindows = { ...windows };

	const currentZindexes: WindowManagerZindex[] = Object.entries(windows).map(([windowId, { state }]) => ({
		windowId,
		zIndex: state.zIndex
	}));
	const updatedZindexByWindowId = updateZindexesOnWindowClicked(currentZindexes, clickedWindowId);
	// Update each window with its new zindex
	for (const update of updatedZindexByWindowId) {
		const windowId = update.windowId;
		updatedWindows[windowId].state.focused = windowId === clickedWindowId;
		updatedWindows[windowId].state.zIndex = update.zIndex;
	}

	updatedWindows[clickedWindowId].state.minimized = false;

	return { ...updatedWindows };
};

export const updateWindowsOnMouseMove = (
	windowId: string,
	windows: Windows,
	event: MouseEvent
): Windows => {
	const windowState = windows[windowId];

	if (!windowState) {
		console.error(`Error handling mouse move: Window ${windowId} not in WindowStates`);
		return windows;
	}

	if (windowState.state.moving) {
		return {
			...windows,
			[windowId]: {
				...windows[windowId],
				state: {
					...windows[windowId].state,
					...moveWindow(event, windows[windowId].state)
				}
			}
		};
	} else if (windowState.state.resizeDirection !== WindowResizeDirection.None) {
		return {
			...windows,
			[windowId]: {
				...windows[windowId],
				state: {
					...windows[windowId].state,
					...resizeWindow(event.clientX, event.clientY, windows[windowId].state)
				}
			}
		};
	}

	return windows;
};

export const setWindowAsMoving = (
	windowId: string,
	windows: Windows,
	event: MouseEvent
): Windows => {
	return {
		...windows,
		[windowId]: {
			...windows[windowId],
			state: {
				...windows[windowId].state,
				moving: true,
				previousClientX: event.clientX,
				previousClientY: event.clientY
			}
		}
	};
};

export const setWindowAsResizing = (
	windowId: string,
	windows: Windows,
	event: MouseEvent,
	direction: WindowResizeDirection
): Windows => {
	return {
		...windows,
		[windowId]: {
			...windows[windowId],
			state: {
				...windows[windowId].state,
				previousClientX: event.clientX,
				previousClientY: event.clientY,
				resizeDirection: direction
			}
		}
	};
};

export const stopMovingAndResizing = (
	windowId: string,
	windows: Windows,
	event: MouseEvent
): Windows => {
	return {
		...windows,
		[windowId]: {
			...windows[windowId],
			state: {
				...windows[windowId].state,
				...stopMovingAndResizingWindow(event.clientX, event.clientY, windows[windowId].state)
			}
		}
	};
};

export const updateWindowsOnMaximize = (windowId: string, windows: Windows): Windows => {
	return {
		...windows,
		[windowId]: {
			...windows[windowId],
			state: {
				...windows[windowId].state,
				...maximizeOrRestoreWindow(windows[windowId].state)
			}
		}
	};
};

export const updateWindowOnHeightMaximize = (windowId: string, windows: Windows): Windows => {
	return {
		...windows,
		[windowId]: {
			...windows[windowId],
			state: {
				...windows[windowId].state,
				...heightMaximizeWindow(windows[windowId].state)
			}
		}
	};
};

export const updateWindowOnCustomMaximize = (
	windowId: string,
	windows: Windows,
	direction: CustomMaximizeDirection
): Windows => {
	return {
		...windows,
		[windowId]: {
			...windows[windowId],
			state: {
				...windows[windowId].state,
				...getWindowStateForCustomMaximize(direction, window.innerWidth, window.innerHeight),
				maximized: WindowMaximize.Custom
			}
		}
	};
};

export const updateWindowWarnBeforeProcessCloses = (windows: Windows, processId: string, warn: boolean) => {
	const window = Object.entries(windows).find(([windowId, state]) => state.process.processId === processId);
	if (!window) {
		console.error(`Error updating warn before close state. Process ${processId} not found.`);
		return windows;
	}

	const windowId = window[0];

	return {
		...windows,
		[windowId]: {
			...window[1],
			warnBeforeClosing: warn
		}
	};
};

export const minimizeWindow = (windowId: string, windows: Windows): Windows => {
	if (!windows[windowId]) {
		console.error(`Error minimizing window: ${windowId}: window not found.`);
		return windows;
	}

	windows[windowId].state.minimized = true;
	windows[windowId].state.focused = false;

	return { ...windows };
};

