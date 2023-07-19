import { FC, useCallback, useContext, useEffect, useState } from 'react';
import { ProcessContext } from '../../contexts/ProcessContext';
import {
	handleZindexesUpdateOnCloseWindow,
	setWindowAsMoving,
	setWindowAsResizing,
	updateWindowOnCustomMaximize,
	updateWindowOnHeightMaximize,
	updateWindowStatesOnNewProcess,
	updateWindowWarnBeforeProcessCloses,
	updateWindowsOnMaximize,
	focusWindow,
	updateWindowsOnMouseMove,
	updateWindowsOnMouseUp
} from '../../services/system/window-manager/WindowManagerService';
import { WindowedProcesses } from '../../types/system/processes/Processes';
import { Windows } from '../../types/system/window-manager/WindowManagerState';
import WindowComponent from './window/Window';
import { WindowResizeDirection } from '../../constants/system/window/WindowResizeDirectionEnum';
import { isEventOriginatedFromWithinTargetIdSubtree } from '../../services/EventService';
import { CustomMaximizeDirection } from '../../constants/system/window/CustomMaximizeDirectionEnum';

export const WindowManager: FC<{ processes: WindowedProcesses }> = ({ processes }) => {
	const { closeProcess } = useContext(ProcessContext);

	const [windows, setWindows] = useState<Windows>({});

	const numWindows = Object.keys(windows).length;

	// update windows (state) by adding or removing new/old processes
	useEffect(() => {
		setWindows(currentStates => {
			return updateWindowStatesOnNewProcess(processes, currentStates);
		});
	}, [processes]);

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

		document.addEventListener('mousedown', unfocusWindowsOnDocumentMouseDown);
		return () => {
			document.removeEventListener('mousedown', unfocusWindowsOnDocumentMouseDown);
		};
	}, [numWindows]);

	const closeWindow = (windowId: string) => {
		const processId = windows[windowId]?.process?.processId;

		if (!processId) {
			console.warn(`Error trying to close window, processId not found (windowId: ${windowId})`);
		} else {
			setWindows(currentWindows => {
				return handleZindexesUpdateOnCloseWindow(windowId, currentWindows);
			});
			closeProcess(processId);
		}
	};

	const handleWindowMouseDown = (clickedWindowId: string) => {
		setWindows(currentWindows => {
			return focusWindow(clickedWindowId, currentWindows);
		});
	};

	const hanldeMouseMove = useCallback((windowId: string, event: MouseEvent) => {
		setWindows(currentWindows => {
			return updateWindowsOnMouseMove(windowId, currentWindows, event);
		});
	}, []);

	const handleStartMoving = (windowId: string, event: MouseEvent) => {
		setWindows(currentWindows => {
			return setWindowAsMoving(windowId, currentWindows, event);
		});
	};

	const handleStartResizing = (windowId: string, event: MouseEvent, direction: WindowResizeDirection) => {
		setWindows(currentWindows => {
			return setWindowAsResizing(windowId, currentWindows, event, direction);
		});
	};

	const handleMouseUp = useCallback((windowId: string, event: MouseEvent) => {
		setWindows(currentWindows => {
			return updateWindowsOnMouseUp(windowId, currentWindows, event);
		});
	}, []);

	const handleMaximize = (windowId: string) => {
		setWindows(currentWindows => {
			return updateWindowsOnMaximize(windowId, currentWindows);
		});
	};

	const handleHeightMaximize = (windowId: string) => {
		setWindows(currentWindows => {
			return updateWindowOnHeightMaximize(windowId, currentWindows);
		});
	};

	const handleMoveToCustomMaximizeOptionClick = (windowId: string, direction: CustomMaximizeDirection) => {
		setWindows(currentWindows => {
			return updateWindowOnCustomMaximize(windowId, currentWindows, direction);
		});
	};

	const updateWarnBeforeProcessCloses = (processId: string, warn: boolean) => {
		setWindows(currentWindows => {
			return updateWindowWarnBeforeProcessCloses(currentWindows, processId, warn);
		});
	};

	return (
		<>
			{Object.entries(windows).map(([windowId, { process, state }]) => {
				return (
					<WindowComponent
						key={windowId}
						windowParams={process.windowParams}
						state={state}
						closeWindow={closeWindow}
						handleWindowMouseDown={handleWindowMouseDown}
						hanldeMouseMove={hanldeMouseMove}
						handleStartMoving={handleStartMoving}
						handleStartResizing={handleStartResizing}
						handleMouseUp={handleMouseUp}
						handleMaximize={handleMaximize}
						handleMoveToCustomMaximizeOptionClick={handleMoveToCustomMaximizeOptionClick}
						handleHeightMaximize={handleHeightMaximize}
					>
						<process.Component updateWarnUserBeforeClose={updateWarnBeforeProcessCloses} params={process.params} />
					</WindowComponent>
				);
			})}
		</>
	);
};
