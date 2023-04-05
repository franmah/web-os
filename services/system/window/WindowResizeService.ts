import { WINDOW_MIN_HEIGH, WINDOW_MIN_WIDTH } from "../../../components/system/window/window";
import { MaximizePlaceholderDirection } from "../../../constants/system/window/MaximizePlaceholderDirectionEnum";
import { WindowResizeDirection } from "../../../constants/system/window/WindowResizeDirectionEnum";
import { WindowState } from "../../../types/system/window/WindowState";
import { isMouseOverTopOfScreen } from "./WindowService";

export const resizeWindow = (mouseX: number, mouseY: number, options: WindowState): WindowState => {
  options.showMaximizePlacehodler = MaximizePlaceholderDirection.None;

  switch (options.resizeDirection) {

    case WindowResizeDirection.Top: {
      document.body.style.cursor = 'n-resize';
      const updatedOptions = resizeTop(mouseY, options);

      if (isMouseOverTopOfScreen(mouseY)) {
        updatedOptions.showMaximizePlacehodler = MaximizePlaceholderDirection.Height;
      }
      
      return updatedOptions;
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
  const newHeight = options.height + addedHeight;

  if (newHeight < WINDOW_MIN_HEIGH) {
    return options;
  }

  return {
    ...options,
    top: updatedTop,
    height: newHeight
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
  const newWidth = options.width + addedWidth;

  if (newWidth < WINDOW_MIN_WIDTH) {
    return options;
  }

  return {
    ...options,
    left: updatedLeft,
    width: newWidth
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