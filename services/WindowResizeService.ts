import { WindowResizeDirection, WindowState } from "../components/system/window/window"
import { TASKBAR_HEIGHT } from "../constants/TaskbarConsts";

export const resizeWindow = (mouseX: number, mouseY: number, options: WindowState): WindowState => {
  console.log('resize: ' + options.resizeDirection)
  switch (options.resizeDirection) {
    case WindowResizeDirection.Top: return resizeTop(mouseY, options);
    case WindowResizeDirection.Bottom: return resizeBottom(mouseY, options);
    case WindowResizeDirection.Left: return resizeLeft(mouseX, options);
    case WindowResizeDirection.Right: return resizeRight(mouseX, options);
    case WindowResizeDirection.TopLeft: {
      const updatedOptions = resizeTop(mouseY, options);
      return resizeLeft(mouseX, updatedOptions);
    }
    case WindowResizeDirection.TopRight: {
      const updatedOptions = resizeTop(mouseY, options);
      return resizeRight(mouseX, updatedOptions);
    }
    case WindowResizeDirection.BottomLeft: {
      const updatedOptions = resizeBottom(mouseY, options);
      return resizeLeft(mouseX, updatedOptions);
    }
    case WindowResizeDirection.BottomRight: {
      const updatedOptions = resizeBottom(mouseY, options);
      return resizeRight(mouseX, updatedOptions);
    }
    default: return options;
  }
};

const resizeTop = (mouseY: number, options: WindowState) : WindowState => {
  const addedHeight = options.top - mouseY;
  return {
    ...options,
    top: mouseY,
    height: options.height + addedHeight,
  }
};

const resizeBottom = (mouseY: number, options: WindowState) : WindowState => {
  const addedHeight = mouseY - (options.top + options.height);

  return {
    ...options,
    height: options.height + addedHeight,
  }
};

const resizeLeft = (mouseX: number, options: WindowState) : WindowState => {
  const addedWidth = options.left - mouseX;
  return {
    ...options,
    left: mouseX,
    width: options.width + addedWidth
  }
};

const resizeRight = (mouseX: number, options: WindowState) : WindowState => {
  const addedWidth = mouseX - (options.width + options.left);

  return {
    ...options,
    width: options.width + addedWidth
  }
};

export  const moveWindow = (event: any, options: WindowState): WindowState => {
  const mouseX = event.clientX;
  const mouseY = event.clientY;

  const changeX = mouseX - options.previousClientX;
  const changeY = isMouseOverTopOfScreen(mouseY) ?
    0 :
    mouseY - options.previousClientY;

  // If window was maximized when move started: restore previous width and height relative to mouse
  if (options.maximized || options.sideMaximized) {
    return getRestoredWindowOptionsRelativeToMouse(mouseX, mouseY, options);
  }

  return {
    ...options,
    maximized: false,
    sideMaximized: false,
    top: Math.max(0, options.top + changeY),
    left: options.left + changeX,
    previousClientX: mouseX,
    previousClientY: mouseY,
  }
};

const getRestoredWindowOptionsRelativeToMouse = (mouseX: number, mouseY: number, options: WindowState): WindowState => {
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
    maximized: false,
    sideMaximized: false,
    top: mouseY,
    left: leftPosition,
    height: options.previousHeight,
    width: options.previousWidth
  }
}

export const finishMovingWindow = (mouseX: number, mouseY: number, options: WindowState): WindowState => {
  const outsideTop = mouseY <= 0;
  const outsideLeft = mouseX <= 0;
  const outsideRight = mouseX >= window.innerWidth;

  if (outsideTop) {
    return {
      ...options,
      maximized: true,
      top: 0,
      left: 0,
      height: window.innerHeight - TASKBAR_HEIGHT,
      width: window.innerWidth
    }
  } else if (outsideLeft) {
    return {
      ...options,
      sideMaximized: true,
      top: 0,
      left: 0,
      width: window.innerWidth / 2,
      height: window.innerHeight - TASKBAR_HEIGHT
    }
  } else if (outsideRight) {
    return {
      ...options,
      sideMaximized: true,
      top: 0,
      left: window.innerWidth / 2,
      width: window.innerWidth / 2,
      height: window.innerHeight - TASKBAR_HEIGHT
    }
  }

  return {
    ...options
  }
}

const isMouseOverTopOfScreen = (mouseY: number) => mouseY < 0;