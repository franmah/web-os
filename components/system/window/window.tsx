import { FC, useEffect, useState } from "react";
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
  previousClientY: number
};

const DEFAULT_WINDOW_STATE: WindowState = {
  top: 150,
  left: 150,
  width: 400,
  height: 400,
  moving: false,
  resizing: false,
  previousClientX: 0,
  previousClientY: 0
};

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
    setOptions(options => ({
      ...options,
      moving: false,
      resizing: false
    }));
  };

  const onHeaderMouseDown = (event: any) => {
    setOptions(state => ({
      ...state,
      moving: true,
      previousClientX: event.clientX,
      previousClientY: event.clientY
    }));
  };

  const onBordersMouseDown = (event: any) => {
    setOptions(state => ({
      ...state,
      resizing: true,
      previousClientX: event.clientX,
      previousClientY: event.clientY
    }));
  };

  const onMouseMove = (event: MouseEvent) => {
    setOptions(options => {
      if (options.moving) {
        return moveWindow(event, options);
      } else if (options.resizing) {
        return resizeWindow(event, options);
      }
      return options;
    });
  };

  const resizeWindow = (event: any, options: WindowState) => {
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    const changeX = mouseX - options.previousClientX;
    const changeY = mouseY - options.previousClientY;

    return {
      ...options,
      width: options.width + changeX,
      height: options.height + changeY,
      previousClientX: mouseX,
      previousClientY: mouseY
    }
  };

  const moveWindow = (event: any, options: WindowState) => {
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    const changeX = mouseX - options.previousClientX;
    const changeY = mouseY - options.previousClientY;
    return {
      ...options,
      top: options.top + changeY,
      left: options.left + changeX,
      previousClientX: mouseX,
      previousClientY: mouseY
    }
  };

  return (
    <div
      className={styles.window}
      onMouseDown={onBordersMouseDown}
      style={{
        top: options.top,
        left: options.left,
        width: options.width,
        height: options.height
      }}
    >

      <div
        onMouseDown={onHeaderMouseDown}
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