import { FC, Fragment, useContext, useEffect, useState } from "react";
import { ProcessContext } from "../../../contexts/processContext";
import { maximizeOrRestoreWindow, moveWindow, resizeWindow, stopMovingAndResizingWindow } from "../../../services/WindowResizeService";
import WindowAnimationPlaceholderComponent from "./animationPlaceholder/animationPlaceholder";
import WindowBorderComponent from "./border/border";
import HeaderComponent, { WindowHeaderOptions } from "./header/header";
import styles from './window.module.scss';

export type WindowParams = {
  processId: string,
  headerOptions?: WindowHeaderOptions
};

export enum WindowResizeDirection {
  Top, Bottom, Left, Right, TopRight, TopLeft, BottomLeft, BottomRight
};

export enum MaximizePlaceholderDirection {
  Full, Left, Right, null
}

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
  showMaximizePlacehodler: MaximizePlaceholderDirection
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
  previousTop: 100,
  previousLeft: 400,
  previousWidth: 1000,
  previousHeight: 600,
  maximized: false,
  sideMaximized: false,
  showMaximizePlacehodler: MaximizePlaceholderDirection.null
};

const WindowComponent: FC<{
  params: WindowParams,
  children: React.ReactNode
}> = ({ params, children }) => {

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
    closeProcess(params.processId);
  };

  return (
    <Fragment>
      <WindowAnimationPlaceholderComponent
        showMaximizePlacehodler={options.showMaximizePlacehodler}
        top={options.top}
        left={options.left}
        width={options.width}
        height={options.height}
      />

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
          isResizing={options.resizing}
          onBordersMouseDown={onBorderMouseDown}
        >

          <div className={styles.centerContent}>
            <HeaderComponent
              options={params.headerOptions}
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