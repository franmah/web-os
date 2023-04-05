import { WindowMaximize } from "../../../constants/system/window/WindowMaximizeEnum";
import { TASKBAR_HEIGHT } from "../../../constants/TaskbarConsts";
import { WindowState } from "../../../types/system/window/WindowState";

export const getRestoredWindowOptionsRelativeToMouse = (mouseX: number, mouseY: number, options: WindowState): WindowState => {
  // should start with mouse in middle and prevent from going out of screen.
  let leftPosition = mouseX -  options.previousWidth / 2;
  leftPosition = Math.max(leftPosition, 0); // Don't go over left side of screen;

  // Dont go over right side of screen
  const windowRight = leftPosition + options.previousWidth;
  leftPosition = windowRight > window.innerWidth ?
    window.innerWidth - options.previousWidth :
    leftPosition;

  return {
    ...options,
    maximized: WindowMaximize.None,
    top: mouseY,
    left: leftPosition,
    height: options.previousHeight,
    width: options.previousWidth
  }
};

export const maximizeOrRestoreWindow = (options: WindowState): WindowState => {
  return {
    ...options,
    top: options.maximized === WindowMaximize.Full ? options.previousTop : 0,
    left: options.maximized === WindowMaximize.Full ? options.previousLeft : 0,
    width: options.maximized === WindowMaximize.Full ? options.previousWidth : window.innerWidth,
    height: options.maximized === WindowMaximize.Full ? options.previousHeight : window.innerHeight - TASKBAR_HEIGHT,
    maximized: options.maximized === WindowMaximize.Full ? WindowMaximize.None : WindowMaximize.Full,
  }
};

export const heightMaximizeWindow = (state: WindowState): WindowState => {
  return {
    ...state,
    top: 0,
    height: window.innerHeight - TASKBAR_HEIGHT,
    maximized: WindowMaximize.Height,
  }
};