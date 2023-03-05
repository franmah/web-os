import { FC, useEffect, useState } from "react";
import { TASKBAR_HEIGHT } from "../../../constants/TaskbarConsts";
import { resizeWindow } from "../../../services/WindowResizeService";
import styles from './window.module.scss';

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
};

const DEFAULT_WINDOW_STATE: WindowState = {
  top: 150,
  left: 150,
  width: 400,
  height: 400,
  moving: false,
  resizing: false,
  resizeDirection: WindowResizeDirection.Top,
  previousClientX: 0,
  previousClientY: 0,
  previousTop: 150,
  previousLeft: 150,
  previousWidth: 400,
  previousHeight: 400
};


/* TODO:
- resizing:
  - enough border width to resize
  - change cursor depending on direction
  - keep cursor changed while resizing even if going out of window
  - Make sure that window.module.scss .topBorderHeader width doesn't mess up when component gets bigger
  - Move the border divs to their own component that accepts children
- Fix maximizing by double clicking (after it's maximized)
- put types in their own folder
- try useRef for better performance
- add icons to top right
- Make sure style matches windows 11


*/

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
const WindowComponent: FC<{ children: React.ReactNode }> = ({ children }) => {

  const [options, setOptions] = useState<WindowState>(DEFAULT_WINDOW_STATE);

  // TODO: event listener on mouseup and mousemove are very inefficient because
  // they set the state every time (needed in order to get most updated state)
  // But that means the component renders on every mousemove/mouseup
  // maybe useRef instead of useState? (not for every field though)
  useEffect(() => {
    document.addEventListener('mouseup', stopMogingAndResizingWindow);
    // Listener on document otherwise window stops updating if mouse moves out of it (if user moves mouse too fast)
    document.addEventListener('mousemove', onMouseMove);

    return () => {
      document.removeEventListener('mouseup', stopMogingAndResizingWindow);
      document.removeEventListener('mousemove', onMouseMove);
    }
  }, []);

  const stopMogingAndResizingWindow = () => {
    setOptions(options => {
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

  const onHeaderMouseDown = (event: any) => {
    setOptions(state => ({
      ...state,
      moving: true,
      previousClientX: event.clientX,
      previousClientY: event.clientY
    }));
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

  const moveWindow = (event: any, options: WindowState): WindowState => {
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    const changeX = mouseX - options.previousClientX;
    const changeY = mouseY - options.previousClientY;
    return {
      ...options,
      top: options.top + changeY,
      left: options.left + changeX,
      previousClientX: mouseX,
      previousClientY: mouseY,
    }
  };

  const maximizeWindow = (event: any) => {
    setOptions(options => {
      const isAlreadyMaximized = 
        options.height === window.innerHeight - TASKBAR_HEIGHT &&
        options.width === window.innerHeight &&
        options.top === 0 &&
        options.left === 0;

      return {
        ...options,
        top: isAlreadyMaximized ? options.previousTop : 0,
        left: isAlreadyMaximized ? options.previousLeft : 0,
        width: isAlreadyMaximized ? options.previousWidth : window.innerWidth,
        height: isAlreadyMaximized ? options.previousHeight : window.innerHeight - TASKBAR_HEIGHT
      }
    });
  };

  return (
    <div
      className={styles.window}
      style={{
        top: options.top,
        left: options.left,
        width: `${options.width}px`,
        height: `${options.height}px`
      }}
    >

    {/*  TOP BORDER */}
    <div className={styles.topBorderHeader}>
      <div
        className={styles.topLeft}
        onMouseDown={event => onBordersMouseDown(event, WindowResizeDirection.TopLeft)}>
      </div>
      <div 
        className={styles.topBorder} 
        onMouseDown={event => onBordersMouseDown(event, WindowResizeDirection.Top)}>
      </div>

      <div
        className={styles.topRight}
        onMouseDown={event => onBordersMouseDown(event, WindowResizeDirection.TopRight)}>
      </div>
    </div>

    {/*  LEFT + RIGHT + CONTENT */}
    <div className={styles.center}>
      <div
        className={styles.centerLeft}
        onMouseDown={event => onBordersMouseDown(event, WindowResizeDirection.Left)}>
      </div>

      <div className={styles.centerContent}>
        <div
          onMouseDown={onHeaderMouseDown}
          onDoubleClick={maximizeWindow}
          className={styles.header}
        >
        </div>

        <div className={styles.childrenContainer}>
          { children }
        </div>
      </div>

      <div
        className={styles.centerRight}
        onMouseDown={event => onBordersMouseDown(event, WindowResizeDirection.Right)}>
      </div>
    </div>

    {/*  BOTTOM BORDER */}
    <div className={styles.bottomHeaderBorder}>
      <div
        className={styles.bottomLeft}
        onMouseDown={event => onBordersMouseDown(event, WindowResizeDirection.BottomLeft)}>
      </div>
      <div
        className={styles.bottomBorder}
        onMouseDown={event => onBordersMouseDown(event, WindowResizeDirection.Bottom)}>
      </div>
      <div
        className={styles.bottomRight}
        onMouseDown={event => onBordersMouseDown(event, WindowResizeDirection.BottomRight)}>
      </div>
    </div>

    </div>
  );
};

export default WindowComponent;