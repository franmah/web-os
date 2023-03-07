import { FC, useEffect, useState } from "react";
import { TASKBAR_HEIGHT } from "../../../constants/TaskbarConsts";
import { resizeWindow } from "../../../services/WindowResizeService";
import WindowBorderComponent from "./border/border";
import HeaderComponent from "./header/header";
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

/* TODO:
- resizing:
  - keep cursor changed while resizing even if going out of window
  - try to move border component outside of window component (see how close, maximize icon reach the top of the window, 
      theres' not extra border layer) 
- Make header it's own component + add icons to top right
  - restore down: VscChromeRestore
  - maximize: VscChromeMaximize
  - minimize: FaRegWindowMinimize
  - maximize/restore should work + animation?
  - maximize/restore should show special menu if click hover icon for a few seconds
  - close should work
- IF TIME: Find a way to show context info when hovergin something for a while (a reusable component or something.)
- Window should size maxmize when hitting top, bottom, left or right of root window element
- put types in their own folder
- try useRef for better performance
- Make sure style matches windows 11
- change shadow box when window is selected
- Fix <HeaderComponent.../> error in window.tsx
- Minimize should be done later
- BIG CHANGE:
  OPTION 1: 
    move useState in components into their own hook so that anyone can change them?
    For example, WindowComponent passes functions to HeaderComponent to maximise and move window.
    But if it had access to the state hook it wouldn't have to.
  OPTION 2:
    move useState into its own hook. Create functions called by children components instead of 
    changing the state directly (like process context, you have to use openProcess, you don't setProcesses
    directly)

- Fix error and warning messages.
- Eventually I'll need a WindowManagerSystemProcess that know where windows are in case I want 
to resize when window hits left/right and user wants anoter window to take the rest of the space


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
const WindowComponent: FC<{ params: any, children: React.ReactNode }> = ({ params, children }) => {

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
        height: `${options.height}px`,
      }}
    >
      <WindowBorderComponent
        onBordersMouseDown={onBordersMouseDown}
      >
        <div className={styles.centerContent}>
          <HeaderComponent
            maximized={options.maximized}
            onHeaderMouseDown={onHeaderMouseDown}
            maximizeWindow={maximizeWindow}
          >
          </HeaderComponent>

          { children }
        </div>
      </WindowBorderComponent>    
    </div>
    
  );
};

export default WindowComponent;