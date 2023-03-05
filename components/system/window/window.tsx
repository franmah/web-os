import { FC, useEffect, useState } from "react";
import { TASKBAR_HEIGHT } from "../../../constants/TaskbarConsts";
import styles from './window.module.scss';

// TODO: move to its own folder
export type WindowState = {
  top: number,
  left: number,
  width: number,
  height: number,
  moving: boolean,
  resizing: boolean,
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
  previousClientX: 0,
  previousClientY: 0,
  previousTop: 150,
  previousLeft: 150,
  previousWidth: 400,
  previousHeight: 400
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
      console.log('setting up previous: saving: ' + (options.moving))
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
        console.log('NOT setting up previous')
        return options;
      }
    });
  };

  const onHeaderMouseDown = (event: any) => {
    console.log('on mouse down: setting moving to true')
    setOptions(state => ({
      ...state,
      moving: true,
      previousClientX: event.clientX,
      previousClientY: event.clientY
    }));
  };

  const onBordersMouseDown = (event: any) => {
    console.log('border mouse down')
    setOptions(state => ({
      ...state,
      resizing: true,
      previousClientX: event.clientX,
      previousClientY: event.clientY
    }));
  };

  const onMouseMove = (event: MouseEvent) => {
    setOptions(options => {
      console.log(options.resizing)
      if (options.moving) {
        return moveWindow(event, options);
      } else if (options.resizing) {
        return resizeWindow(event, options);
      }
      return options;
    });
  };

  const resizeWindow = (event: any, options: WindowState): WindowState => {
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    const changeX = mouseX - options.previousClientX;
    const changeY = mouseY - options.previousClientY;
    console.log(changeX)
    return {
      ...options,
      width: options.width + changeX,
      height: options.height + changeY,
      previousClientX: mouseX,
      previousClientY: mouseY,
    }
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
    console.log('double click')
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
      onMouseDown={onBordersMouseDown}
      style={{
        top: options.top,
        left: options.left,
        width: `${options.width}px`,
        height: `${options.height}px`
      }}
    >

      <div
        onMouseDown={onHeaderMouseDown}
        onDoubleClick={maximizeWindow}
        onDragCapture={() => console.log("drag start")}
        className={styles.header}
      >
      </div>

      <div className={styles.childrenContainer}>
        { children }
      </div>
     
    </div>
  );
};

export default WindowComponent;