import { MaximizePlaceholderDirection } from '../../../constants/system/window/MaximizePlaceholderDirectionEnum';
import { WindowMaximize } from '../../../constants/system/window/WindowMaximizeEnum';
import { WindowResizeDirection } from '../../../constants/system/window/WindowResizeDirectionEnum';
import { TASKBAR_HEIGHT } from '../../../constants/Taskbar';
import { WindowState } from '../../../types/system/window/WindowState';
import { finishMovingWindow } from './MoveWindowService';

const saveWindowPosition = (options: WindowState): WindowState => {
	return {
		...options,
		previousTop: options.top,
		previousLeft: options.left,
		previousHeight: options.height,
		previousWidth: options.width
	};
};

export const stopMovingAndResizingWindow = (mouseX: number, mouseY: number, options: WindowState): WindowState => {
	document.body.style.cursor = 'default';

	// Prevent save position when clicking header and window is maximized
	if (options.maximized === WindowMaximize.Full || options.maximized === WindowMaximize.Side) {
		return {
			...options,
			moving: false,
			resizeDirection: WindowResizeDirection.None
		};
	}

	if (
		options.resizeDirection === WindowResizeDirection.Top &&
		options.showMaximizePlacehodler === MaximizePlaceholderDirection.Height
	) {
		return {
			...options,
			showMaximizePlacehodler: MaximizePlaceholderDirection.None,
			resizeDirection: WindowResizeDirection.None,
			maximized: WindowMaximize.Height,
			top: 0,
			height: window.innerHeight - TASKBAR_HEIGHT
		};
	}

	if (options.resizeDirection === WindowResizeDirection.None && !options.moving) {
		return options;
	}

	options.maximized = WindowMaximize.None;

	if (options.moving) {
		options = finishMovingWindow(mouseX, mouseY, options);
	}

	if (options.resizeDirection !== WindowResizeDirection.None && isMouseOverTopOfScreen(mouseY)) {
		options = {
			...options,
			maximized: WindowMaximize.Side,
			top: 0,
			height: window.innerHeight - TASKBAR_HEIGHT
		};
	}

	if (options.maximized === WindowMaximize.None) {
		options = saveWindowPosition(options);
	}

	options.showMaximizePlacehodler = MaximizePlaceholderDirection.None;
	options.resizeDirection = WindowResizeDirection.None;
	options.moving = false;

	return { ...options };
};

export const isMouseOverTopOfScreen = (mouseY: number) => mouseY <= 0;

export const isMouseLeftOfScreen = (mouseX: number) => mouseX <= 0;

export const isMouseRightOfScreen = (mouseX: number) => mouseX >= window.innerWidth;
