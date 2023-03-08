import { FC, Fragment, useContext, useEffect, useState } from "react";
import { ProcessContext } from "../../../contexts/processContext";
import { maximizeOrRestoreWindow, moveWindow, resizeWindow, stopMovingAndResizingWindow } from "../../../services/WindowResizeService";
import WindowBorderComponent from "./border/border";
import HeaderComponent from "./header/header";
import styles from './window.module.scss';

export type WindowParams = {
  processId: string
};

export enum WindowResizeDirection {
  Top, Bottom, Left, Right, TopRight, TopLeft, BottomLeft, BottomRight
};

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
  maximized: boolean,
  sideMaximized: boolean,
  showMaximizePlacehodler: 'full' | 'left' | 'right' | null
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
  maximized: false,
  sideMaximized: false,
  showMaximizePlacehodler: null
};

const WindowComponent: FC<{
  params: WindowParams,
  children: React.ReactNode
}> = ({ params: { processId }, children }) => {

  const { closeProcess } = useContext(ProcessContext);

  const [options, setOptions] = useState<WindowState>(DEFAULT_WINDOW_STATE);

  // TODO: event listener on mouseup and mousemove are very inefficient because
  // they set the state every time (needed in order to get most updated state)
  // But that means the component renders on every mousemove/mouseup
  // maybe useRef instead of useState? (not for every field though)
  useEffect(() => {
    document.addEventListener('mouseup', onMouseUp);
    // Listener on document otherwise window stops updating if mouse moves out of it (if user moves mouse too fast)
    document.addEventListener('mousemove', onMouseMove);

    return () => {
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mousemove', onMouseMove);
    }
  }, []);

  const onMouseUp = (event: MouseEvent) => {
    setOptions(options => {
     return stopMovingAndResizingWindow(event.clientX, event.clientY, options);
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

  const onBorderMouseDown = (event: any, direction: WindowResizeDirection) => {
    setOptions(state => ({
      ...state,
      resizing: true,
      previousClientX: event.clientX,
      previousClientY: event.clientY,
      resizeDirection: direction
    }));
  };

  const onHeaderDoubleClick = (event: any) => {
    setOptions(options => {
      return maximizeOrRestoreWindow(options);
    });
  };

  const closeWindowProcess = () => {
    closeProcess(processId);
  };

  const maximizeAnimation = (left: number, width: number, height: number) => {
    return `
      @keyframes window-maximize-animation {
        0%   {top: ${0}px; left: ${left}px; width: ${width}px; height: ${height}px;}
        90%   {top: ${0}px; left: ${8}px; width: calc(100% - 16px); height: calc(100% - 65px);}
        100% {top: ${8}px; left: ${8}px; width: calc(100% - 16px); height: calc(100% - 65px);}
      }
    `;
  };

  const leftMaximizeAnimation = (top: number, height: number) => {
    return `
      @keyframes window-left-maximize-animation {
        0%   {top: ${top}px; left: ${0}px; width: ${0}px; height: ${height}px;}
        90%   {top: ${8}px; left: ${0}px; width: calc(100% / 2 - 8px); height: calc(100% - 65px);}
        100% {top: ${8}px; left: ${8}px; width: calc(100% / 2 - 8px); height: calc(100% - 65px);}
      }
    `;
  };

  const rightMaximizeAnimation = (top: number, height: number) => {
    return `
      @keyframes window-right-maximize-animation {
        0%   {top: ${top}px; right: ${0}px; width: ${0}px; height: ${height}px;}
        90%   {top: ${8}px; right: ${8}px; width: calc(100% / 2 - 8px); height: calc(100% - 65px);}
        100% {top: ${8}px; right: ${8}px; width:calc(100% / 2 - 8px); height: calc(100% - 65px);}
      }
    `;
  };

  return (
    <Fragment>
      <style children={`
        ${maximizeAnimation(options.left, options.width, options.height)} 
        ${leftMaximizeAnimation(options.top, options.height)} 
        ${rightMaximizeAnimation(options.top, options.height)}
      `}/>

      <Fragment>
        {
          options.showMaximizePlacehodler === 'full' &&
          <div
            style={{ animationName: 'window-maximize-animation'}}
            className={styles.maximizePlaceholderModal}
          >
          </div>
        }
        {
          options.showMaximizePlacehodler === 'left' && 
          <div 
            className={styles.leftSideMaximizePlaceholderModal} 
            style={{ animationName: 'window-left-maximize-animation'}}
          ></div>
        }
        { 
          options.showMaximizePlacehodler === 'right' &&
          <div 
            className={styles.rightSideMaximizePlaceholderModal}
            style={{ animationName: 'window-right-maximize-animation'}}
          ></div>
        }
      </Fragment>

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
          allowResize={!options.maximized}
          onBordersMouseDown={onBorderMouseDown}
        >

          <div className={styles.centerContent}>
            <HeaderComponent
              maximized={options.maximized}
              startMovingWindow={onHeaderClick}
              maximizeWindow={onHeaderDoubleClick}
              onClose={closeWindowProcess}
            >
            </HeaderComponent>

            { children }
          </div>

        </WindowBorderComponent>    
      </div>
    </Fragment>
  );
};

export default WindowComponent;