import { WindowResizeDirection, WindowState } from "../components/system/window/window"

export const resizeWindow = (mouseX: number, mouseY: number, options: WindowState): WindowState => {
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
