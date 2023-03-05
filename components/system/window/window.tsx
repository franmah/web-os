import { FC, useEffect, useState } from "react";
import styles from './window.module.scss';

// TODO: move to its own folder
export type WindowState = {
  top: number,
  left: number,
  width: number,
  height: number,
  moving: boolean,
  previousClientX: number,
  previousClientY: number
};

const DEFAULT_WINDOW_STATE: WindowState = {
  top: 150,
  left: 150,
  width: 400,
  height: 400,
  moving: false,
  previousClientX: 0,
  previousClientY: 0 //TODO: move to its own state
};

const WindowComponent: FC<{ children: React.ReactNode }> = ({ children }) => {

  const [options, setOptions] = useState<WindowState>(DEFAULT_WINDOW_STATE);

  useEffect(() => {

    document.addEventListener('mouseup', stopMogingWindow);

    return () => {
      document.removeEventListener('mouseup', stopMogingWindow);
    }
  }, []);

  const stopMogingWindow = () => {
    setOptions(options => ({
      ...options,
      moving: false
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
  

  const moveWindow = (event: any) => {

    setOptions(options => {
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
    });
  };

  return (
    <div
      className={styles.window}
      style={{
        top: options.top,
        left: options.left,
        width: options.width,
        height: options.height
      }}
    >

      <div
        onMouseMove={event => options.moving && moveWindow(event)}
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