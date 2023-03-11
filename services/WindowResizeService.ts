import { MaximizePlaceholderDirection, WindowResizeDirection, WindowState } from "../components/system/window/window"
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

  // If window was maximized when move started: restore previous width and height relative to mouse
  if (options.maximized || options.sideMaximized) {
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
    maximized: false,
    sideMaximized: false,
    top: Math.max(0, options.top + changeY),
    left: options.left + changeX,
    previousClientX: mouseX,
    previousClientY: mouseY,
  }
};

export const stopMovingAndResizingWindow = (mouseX:number, mouseY: number, options: WindowState): WindowState => {
  document.body.style.cursor = 'default';
  
  // Prevent save position when clicking header and window is maximized
  if (options.maximized || options.sideMaximized) {
    return {
      ...options,
      moving: false,
      resizing: false
    }
  }

  if (!options.resizing && !options.moving) {
    return options;
  }

  // BUG: saving position before checking if the window has been moved to the side and set as side maximized.
  // When double clicking it will remember this position rather than real original position.
  options.maximized = false;

  
  if (options.moving) {
    options = finishMovingWindow(mouseX, mouseY, options);
  }

  if (options.resizing && isMouseOverTopOfScreen(mouseY)) {
    options = {
      ...options,
      sideMaximized: true,
      top: 0,
      height: window.innerHeight - TASKBAR_HEIGHT
    }
  }

  if (!options.maximized && !options.sideMaximized) {
    options = saveWindowPosition(options);
  }

  options.showMaximizePlacehodler = MaximizePlaceholderDirection.null;
  options.resizing = false;
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
}

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
};

export const maximizeOrRestoreWindow = (options: WindowState): WindowState => {
  if (options.sideMaximized) {
    return {
      ...options,
      sideMaximized: false,
      top: options.previousTop,
      left: options.previousLeft,
      width: options.previousWidth,
      height: options.previousHeight
    }
  }

  return {
    ...options,
    top: options.maximized ? options.previousTop : 0,
    left: options.maximized ? options.previousLeft : 0,
    width: options.maximized ? options.previousWidth : window.innerWidth,
    height: options.maximized ? options.previousHeight : window.innerHeight - TASKBAR_HEIGHT,
    maximized: !options.maximized,
  }
};

const isMouseOverTopOfScreen = (mouseY: number) => mouseY <= 0;

const isMouseLeftOfScreen = (mouseX: number) => mouseX <= 0;

const isMouseRightOfScreen = (mouseX: number) => mouseX >= window.innerWidth;