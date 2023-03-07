import { FC, useContext, useEffect, useState } from "react";
import { TASKBAR_HEIGHT } from "../../../constants/TaskbarConsts";
import { ProcessContext } from "../../../contexts/processContext";
import { resizeWindow } from "../../../services/WindowResizeService";
import WindowBorderComponent from "./border/border";
import HeaderComponent from "./header/header";
import styles from './window.module.scss';

export type WindowParams = {
  processId: string
};

export enum WindowResizeDirection {
  Top, Bottom, Left, Right, TopRight, TopLeft, BottomLeft, BottomRight
};

// TODO: move to its own folder
export type WindowState = {
  top: number,
  left: number,
  width: number,
  height: number,
  moving: boolean,
  resizing: boolean,
  resizeDirection: WindowResizeDirection,
  previousClientX: number,
  previousClientY: number,
  previousTop: number,
  previousLeft: number,
  previousWidth: number,
  previousHeight: number,
  maximized: boolean
};

const DEFAULT_WINDOW_STATE: WindowState = {
  top: 100,
  left: 400,
  width: 1000,
  height: 600,
  moving: false,
  resizing: false,
  resizeDirection: WindowResizeDirection.Top,
  previousClientX: 0,
  previousClientY: 0,
  previousTop: 150,
  previousLeft: 150,
  previousWidth: 400,
  previousHeight: 400,
  maximized: false
};

/**
 * ISSUE:
 * When window is in fullscreen, the previous position is saved.
 * When double clicking, it triggers a mouse down that will set the options to resize/move
 * which then sets the previous position (stopMovingAndResizingWindow) to full
 * 
 * See this for how to use event.detail + timeout
 * https://stackoverflow.com/a/60177326
 * onMouseDown functions whould have to setTimeout before moving/resizing to make sure it's not a double click
 * 
 * Or maybe use on drag start
 */
const WindowComponent: FC<{
  params: WindowParams,
  children: React.ReactNode }
> = ({ params: { processId }, children }) => {

  const { closeProcess } = useContext(ProcessContext);

  const [options, setOptions] = useState<WindowState>(DEFAULT_WINDOW_STATE);

  // TODO: event listener on mouseup and mousemove are very inefficient because
  // they set the state every time (needed in order to get most updated state)
  // But that means the component renders on every mousemove/mouseup
  // maybe useRef instead of useState? (not for every field though)
  useEffect(() => {
    document.addEventListener('mouseup', stopMovingAndResizingWindow);
    // Listener on document otherwise window stops updating if mouse moves out of it (if user moves mouse too fast)
    document.addEventListener('mousemove', onMouseMove);

    return () => {
      document.removeEventListener('mouseup', stopMovingAndResizingWindow);
      document.removeEventListener('mousemove', onMouseMove);
    }
  }, []);

  const stopMovingAndResizingWindow = () => {
    setOptions(options => {
      // Prevent save position when clicking header and window is maximized
      if (options.maximized) {
        return {
          ...options,
          moving: false,
          resizing: false
        }
      }

      if (options.resizing || options.moving) {
        return {
          ...options,
          moving: false,
          resizing: false,
          previousTop: options.top,
          previousLeft: options.left,
          previousHeight: options.height,
          previousWidth: options.width
        }
      } else {
        return options;
      }
    });
  };

  const onHeaderClick = (event: any) => {
    setOptions(state => {     
      return {
        ...state,
        moving: true,
        previousClientX: event.clientX,
        previousClientY: event.clientY
      };
    });
  };

  const onMouseMove = (event: MouseEvent) => {
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    setOptions(options => {
      if (options.moving) {
        return moveWindow(event, options);
      } else if (options.resizing) {
        return resizeWindow(mouseX, mouseY, options);
      }
      return options;
    });
  };

  const onBordersMouseDown = (event: any, direction: WindowResizeDirection) => {
    setOptions(state => ({
      ...state,
      resizing: true,
      previousClientX: event.clientX,
      previousClientY: event.clientY,
      resizeDirection: direction
    }));
  };

  const moveWindow = (event: any, options: WindowState): WindowState => {
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    const changeX = mouseX - options.previousClientX;
    const changeY = mouseY - options.previousClientY;

    // If window was maximized when move started: restore previous width and height relative to mouse
    if (options.maximized) {
      return getRestoredWindowOptionsRelativeToMouse(mouseX, mouseY, options);
    };

    return {
      ...options,
      maximized: false,
      top: options.top + changeY,
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
      top: mouseY,
      left: leftPosition,
      height: options.previousHeight,
      width: options.previousWidth
    }
  }

  const maximizeOrRestoreWindow = (event: any) => {
    setOptions(options => {
      return {
        ...options,
        top: options.maximized ? options.previousTop : 0,
        left: options.maximized ? options.previousLeft : 0,
        width: options.maximized ? options.previousWidth : window.innerWidth,
        height: options.maximized ? options.previousHeight : window.innerHeight - TASKBAR_HEIGHT,
        maximized: !options.maximized
      }
    });
  };

  const closeWindowProcess = () => {
    closeProcess(processId);
  };

  return (
    <div
      className={styles.window}
      style={{
        top: options.top,
        left: options.left,
        width: `${options.width}px`,
        height: `${options.height}px`,
      }}
    >
      <WindowBorderComponent
        onBordersMouseDown={onBordersMouseDown}
      >
        <div className={styles.centerContent}>
          <HeaderComponent
            onClose={closeWindowProcess}
            maximized={options.maximized}
            startMovingWindow={onHeaderClick}
            maximizeWindow={maximizeOrRestoreWindow}
          >
          </HeaderComponent>

          { children }
        </div>
      </WindowBorderComponent>    
    </div>
  );
};

export default WindowComponent;