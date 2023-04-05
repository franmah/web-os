import { CustomMaximizeDirection } from "../../../components/system/window/maximizeOptionsModal/maximizeOptionsModal";
import { TASKBAR_HEIGHT } from "../../../constants/TaskbarConsts";
import { WindowState } from "../../../types/system/window/WindowState";

export const getWindowStateForCustomMaximize = (direction: CustomMaximizeDirection,
windowWidth: number, windowHeight: number): Partial<WindowState> => {
  switch (direction) {
    case CustomMaximizeDirection.Left: return left(windowWidth, windowHeight);
    case CustomMaximizeDirection.Right: return right(windowWidth, windowHeight);
    case CustomMaximizeDirection.LargerLeft: return largerLeft(windowWidth, windowHeight);
    case CustomMaximizeDirection.SmallerRight: return smallerRight(windowWidth, windowHeight);
    case CustomMaximizeDirection.TopRight: return topRight(windowWidth, windowHeight);
    case CustomMaximizeDirection.TopLeft: return topLeft(windowWidth, windowHeight);
    case CustomMaximizeDirection.BottomLeft: return bottomeLeft(windowWidth, windowHeight);
    case CustomMaximizeDirection.BottomRight: return bottomRight(windowWidth, windowHeight);
    default: return {};
  };
};

const left = (width: number, height: number) => ({
  top: 0,
  left: 0,
  width: width / 2,
  height: height - TASKBAR_HEIGHT
});

const right = (width: number, height: number) => ({
  top: 0,
  left: width / 2,
  width :width / 2, 
  height: height - TASKBAR_HEIGHT
});

const largerLeft = (width: number, height: number) => ({
  top: 0,
  left: 0,
  width: width / 1.5,
  height: height - TASKBAR_HEIGHT
});

const smallerRight = (width: number, height: number) => ({
  top: 0,
  left: width / 1.5,
  width: width / 3,
  height: height - TASKBAR_HEIGHT
});

const topLeft = (width: number, height: number) => ({
  top: 0,
  left: 0,
  width: width / 2,
  height: height / 2
});

const topRight = (width: number, height: number) => ({
  top: 0,
  left: width / 2,
  width: width / 2,
  height: height / 2
});

const bottomeLeft = (width: number, height: number) => ({
  top: (height / 2) - TASKBAR_HEIGHT,
  left: 0,
  width: width / 2,
  height: height / 2
});

const bottomRight = (width: number, height: number) => ({
  top: (height / 2) - TASKBAR_HEIGHT,
  left: width / 2,
  width: width / 2,
  height: height / 2 
});