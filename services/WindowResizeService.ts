import { MaximizePlaceholderDirection, WindowMaximize, WindowResizeDirection, WindowState } from "../components/system/window/window"
import { TASKBAR_HEIGHT } from "../constants/TaskbarConsts";

export const resizeWindow = (mouseX: number, mouseY: number, options: WindowState): WindowState => {
  switch (options.resizeDirection) {
    case WindowResizeDirection.Top: {
      document.body.style.cursor = 'n-resize';
      return resizeTop(mouseY, options);
    } 
    
    case WindowResizeDirection.Bottom: {
      document.body.style.cursor = 'n-resize';
      return resizeBottom(mouseY, options);
    } 
    
    case WindowResizeDirection.Left: {
      document.body.style.cursor = 'e-resize';
      return resizeLeft(mouseX, options);
    } 
    
    case WindowResizeDirection.Right: {
      document.body.style.cursor = 'e-resize';
      return resizeRight(mouseX, options);
    } 
    
    case WindowResizeDirection.TopLeft: {
      document.body.style.cursor = 'se-resize';
      const updatedOptions = resizeTop(mouseY, options);
      return resizeLeft(mouseX, updatedOptions);
    } 
    
    case WindowResizeDirection.TopRight: {
      document.body.style.cursor = 'ne-resize';
      const updatedOptions = resizeTop(mouseY, options);
      return resizeRight(mouseX, updatedOptions);
    } 
    
    case WindowResizeDirection.BottomLeft: {
      document.body.style.cursor = 'ne-resize';
      const updatedOptions = resizeBottom(mouseY, options);
      return resizeLeft(mouseX, updatedOptions);
    } 
    
    case WindowResizeDirection.BottomRight: {
      document.body.style.cursor = 'se-resize';
      const updatedOptions = resizeBottom(mouseY, options);
      return resizeRight(mouseX, updatedOptions);
    }

    default: return options;
  }
};

const resizeTop = (mouseY: number, options: WindowState) : WindowState => {
  const updatedTop = Math.max(0, mouseY);
  const addedHeight = options.top - updatedTop;

  return {
    ...options,
    top: updatedTop,
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
  const updatedLeft = Math.max(0, mouseX);
  const addedWidth = options.left - updatedLeft;

  return {
    ...options,
    left: updatedLeft,
    width: options.width + addedWidth
  }
};

const resizeRight = (mouseX: number, options: WindowState) : WindowState => {
  const addedWidth = mouseX - (options.width + options.left);
  const updatedWidth = options.width + addedWidth;

  return {
    ...options,
    width: options.left + updatedWidth > window.innerWidth ? 
      updatedWidth - (options.left + updatedWidth - window.innerWidth) :
      updatedWidth
  }
};

export  const moveWindow = (event: any, options: WindowState): WindowState => {
  const mouseX = event.clientX;
  const mouseY = event.clientY;

  if (options.maximized !== WindowMaximize.None) {
    return getRestoredWindowOptionsRelativeToMouse(mouseX, mouseY, options);
  }

  const changeX = isMouseLeftOfScreen(mouseX) || isMouseRightOfScreen(mouseX) ?
    0 :
    mouseX - options.previousClientX;
  const changeY = isMouseOverTopOfScreen(mouseY) ?
    0 :
    mouseY - options.previousClientY;

  const showMaximizePlacehodler =
    isMouseOverTopOfScreen(mouseY) ? MaximizePlaceholderDirection.Full :
    isMouseLeftOfScreen(mouseX) ? MaximizePlaceholderDirection.Left :
    isMouseRightOfScreen(mouseX) ? MaximizePlaceholderDirection.Right :
    MaximizePlaceholderDirection.null;

  return {
    ...options,
    showMaximizePlacehodler,
    maximized: WindowMaximize.None,
    top: Math.max(0, options.top + changeY),
    left: options.left + changeX,
    previousClientX: mouseX,
    previousClientY: mouseY,
  }
};

export const stopMovingAndResizingWindow = (mouseX:number, mouseY: number, options: WindowState): WindowState => {
  document.body.style.cursor = 'default';
  
  // Prevent save position when clicking header and window is maximized
  if (options.maximized === WindowMaximize.Full|| options.maximized === WindowMaximize.Side) {
    return {
      ...options,
      moving: false,
      resizeDirection: WindowResizeDirection.None
    }
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
    }
  }

  if (options.maximized === WindowMaximize.None) {
    options = saveWindowPosition(options);
  }

  options.showMaximizePlacehodler = MaximizePlaceholderDirection.null;
  options.resizeDirection = WindowResizeDirection.None
  options.moving = false;

  return { ...options };
};

const saveWindowPosition = (options: WindowState): WindowState => {
  return {
    ...options,
    previousTop: options.top,
    previousLeft: options.left,
    previousHeight: options.height,
    previousWidth: options.width
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
    maximized: WindowMaximize.None,
    top: mouseY,
    left: leftPosition,
    height: options.previousHeight,
    width: options.previousWidth
  }
};

export const finishMovingWindow = (mouseX: number, mouseY: number, options: WindowState): WindowState => {
  const outsideTop = mouseY <= 0;
  const outsideLeft = mouseX <= 0;
  const outsideRight = mouseX >= window.innerWidth;

  if (outsideTop) {
    return {
      ...options,
      maximized: WindowMaximize.Full,
      top: 0,
      left: 0,
      height: window.innerHeight - TASKBAR_HEIGHT,
      width: window.innerWidth
    }
  } else if (outsideLeft) {
    return {
      ...options,
      maximized: WindowMaximize.Side,
      top: 0,
      left: 0,
      width: window.innerWidth / 2,
      height: window.innerHeight - TASKBAR_HEIGHT
    }
  } else if (outsideRight) {
    return {
      ...options,
      maximized: WindowMaximize.Side,
      top: 0,
      left: window.innerWidth / 2,
      width: window.innerWidth / 2,
      height: window.innerHeight - TASKBAR_HEIGHT
    }
  }

  return {
    ...options
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

const isMouseOverTopOfScreen = (mouseY: number) => mouseY <= 0;

const isMouseLeftOfScreen = (mouseX: number) => mouseX <= 0;

const isMouseRightOfScreen = (mouseX: number) => mouseX >= window.innerWidth;