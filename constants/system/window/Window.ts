import { WindowState } from '../../../types/system/window/WindowState';
import { MaximizePlaceholderDirection } from './MaximizePlaceholderDirectionEnum';
import { WindowMaximize } from './WindowMaximizeEnum';
import { WindowResizeDirection } from './WindowResizeDirectionEnum';

export const DEFAULT_WINDOW_STATE: WindowState = {
	focused: true,
	height: 600,
	left: 200,
	maximized: WindowMaximize.None,
	minimized: false,
	moving: false,
	previousClientX: 0,
	previousClientY: 0,
	previousHeight: 600,
	previousLeft: 400,
	previousTop: 100,
	previousWidth: 1000,
	resizeDirection: WindowResizeDirection.None,
	showMaximizePlacehodler: MaximizePlaceholderDirection.None,
	top: 100,
	recentlyUnminimized: false, // Indicate the window has been uniminized in the last few milliseconds
	width: 1000,
	zIndex: 100
};
