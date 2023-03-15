import { MaximizePlaceholderDirection } from "../../../constants/system/window/MaximizePlaceholderDirectionEnum";
import { WindowMaximize } from "../../../constants/system/window/WindowMaximizeEnum";
import { TASKBAR_HEIGHT } from "../../../constants/TaskbarConsts";
import { WindowState } from "../../../types/system/window/WindowState";
import { getRestoredWindowOptionsRelativeToMouse } from "./MaximizeRestoreWindowService";
import { isMouseLeftOfScreen, isMouseOverTopOfScreen, isMouseRightOfScreen } from "./WindowService";

export  const moveWindow = (event: any, options: WindowState): Partial<WindowState> => {
  const mouseX = event.clientX;
  const mouseY = event.clientY;

  if (options.maximized !== WindowMaximize.None) {
    return getRestoredWindowOptionsRelativeToMouse(mouseX, mouseY, options);
  }

  const changeX = isMouseLeftOfScreen(mouseX) || isMouseRightOfScreen(mouseX) ?
    0 :
    mouseX - options.previousClientX;

  const showMaximizePlacehodler =
    isMouseOverTopOfScreen(mouseY) ? MaximizePlaceholderDirection.Full :
    isMouseLeftOfScreen(mouseX) ? MaximizePlaceholderDirection.Left :
    isMouseRightOfScreen(mouseX) ? MaximizePlaceholderDirection.Right :
    MaximizePlaceholderDirection.None;

  return {
    showMaximizePlacehodler,
    maximized: WindowMaximize.None,
    top: Math.max(0, mouseY),
    left: options.left + changeX,
    previousClientX: mouseX,
    previousClientY: mouseY,
  }
};

export const finishMovingWindow = (mouseX: number, mouseY: number, options: WindowState): Partial<WindowState> => {
  const outsideTop = mouseY <= 0;
  const outsideLeft = mouseX <= 0;
  const outsideRight = mouseX >= window.innerWidth;

  if (outsideTop) {
    return {
      maximized: WindowMaximize.Full,
      top: 0,
      left: 0,
      height: window.innerHeight - TASKBAR_HEIGHT,
      width: window.innerWidth
    }
  } else if (outsideLeft) {
    return {
      maximized: WindowMaximize.Side,
      top: 0,
      left: 0,
      width: window.innerWidth / 2,
      height: window.innerHeight - TASKBAR_HEIGHT
    }
  } else if (outsideRight) {
    return {
      maximized: WindowMaximize.Side,
      top: 0,
      left: window.innerWidth / 2,
      width: window.innerWidth / 2,
      height: window.innerHeight - TASKBAR_HEIGHT
    }
  }

  return {}
};