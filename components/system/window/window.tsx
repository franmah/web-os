import { FC, Fragment, useContext, useEffect, useState } from "react";
import { ProcessContext } from "../../../contexts/processContext";
import { isEventOriginatedFromWithinTargetIdSubtree } from "../../../services/EventService";
import { getWindowOptionForCustomMaximize } from "../../../services/system/window/WindowCustomMaximizeOptionService.ts";
import { maximizeOrRestoreWindow, moveWindow, resizeWindow, stopMovingAndResizingWindow } from "../../../services/WindowResizeService";
import WindowAnimationPlaceholderComponent from "./animationPlaceholder/animationPlaceholder";
import WindowBorderComponent from "./border/border";
import HeaderComponent, { WindowHeaderOptions } from "./header/header";
import { CustomMaximizeDirection } from "./maximizeOptionsModal/maximizeOptionsModal";
import styles from './window.module.scss';

export type WindowParams = {
  processId: string,
  windowId: string,
  headerOptions?: WindowHeaderOptions,
};

export enum WindowMaximize {
  Full, Side, Height, None
};

export enum WindowResizeDirection {
  Top, Bottom, Left, Right, TopRight, TopLeft, BottomLeft, BottomRight, None
};

export enum MaximizePlaceholderDirection {
  Full, Left, Right, null
};

export type WindowState = {
  top: number,
  left: number,
  width: number,
  height: number,
  moving: boolean,
  resizeDirection: WindowResizeDirection,
  previousClientX: number,
  previousClientY: number,
  previousTop: number,
  previousLeft: number,
  previousWidth: number,
  previousHeight: number,
  maximized: WindowMaximize,
  showMaximizePlacehodler: MaximizePlaceholderDirection,
  selected: boolean
};

const DEFAULT_WINDOW_STATE: WindowState = {
  top: 100,
  left: 400,
  width: 1000,
  height: 600,
  previousClientX: 0,
  previousClientY: 0,
  previousTop: 100,
  previousLeft: 400,
  previousWidth: 1000,
  previousHeight: 600,
  moving: false,
  maximized: WindowMaximize.None,
  resizeDirection: WindowResizeDirection.None,
  showMaximizePlacehodler: MaximizePlaceholderDirection.null,
  selected: true
};

const WindowComponent: FC<{
  windowParams: WindowParams,
  children: React.ReactNode
}> = ({ windowParams, children }) => {

  const { closeProcess } = useContext(ProcessContext);

  const [options, setOptions] = useState<WindowState>(DEFAULT_WINDOW_STATE);

  const closeWindowProcess = () => {
    closeProcess(windowParams.processId);
  };

  useEffect(() => {
    // Listener on document otherwise window stops updating if mouse moves out of it (if user moves mouse too fast)
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mousedown', onDocumentMouseDown);

    return () => {
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mousedown', onDocumentMouseDown);
    }
  }, []);

  const onDocumentMouseDown = (event: MouseEvent) => {
    if (isEventOriginatedFromWithinTargetIdSubtree(event, windowParams.windowId)) {
      setOptions(currentOptions => ({ ...currentOptions, selected: true }));
    } else {
      setOptions(currentOptions => ({ ...currentOptions, selected: false }));
    }
  };

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
      } else if (options.resizeDirection !== WindowResizeDirection.None) {
        return resizeWindow(mouseX, mouseY, options);
      }
      return options;
    });
  };

  const onBorderMouseDown = (event: any, direction: WindowResizeDirection) => {
    setOptions(state => ({
      ...state,
      previousClientX: event.clientX,
      previousClientY: event.clientY,
      resizeDirection: direction
    }));
  };

  const maximizeWindow = (event: any) => {
    setOptions(options => {
      return maximizeOrRestoreWindow(options);
    });
  };

  
  const moveToCustomMaximizeOptionClick = (direction: CustomMaximizeDirection) => {
    setOptions(options => ({
      ...options,
      maximized: WindowMaximize.Side,
      ...getWindowOptionForCustomMaximize(direction, window.innerWidth, window.innerHeight)
    }));
  };

  const getClass = () => {
    return `${styles.window} ${ options.selected ? styles.windowSelected : styles.windowUnselected}`;
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
        id={windowParams.windowId}
        className={getClass()}
        style={{
          top: options.top,
          left: options.left,
          width: `${options.width}px`,
          height: `${options.height}px`,
        }}
      >

        <WindowBorderComponent
          allowResize={options.maximized !== WindowMaximize.Full && !options.moving}
          isResizing={options.resizeDirection !== WindowResizeDirection.None}
          onBordersMouseDown={onBorderMouseDown}
        >

          <div className={styles.centerContent}>
            <HeaderComponent
              selected={options.selected}
              options={windowParams.headerOptions}
              maximized={options.maximized}
              startMovingWindow={onHeaderClick}
              maximizeWindow={maximizeWindow}
              onClose={closeWindowProcess}
              moveToCustomMaximizeOptionClick={(direction) => moveToCustomMaximizeOptionClick(direction)}
            />

            { children }
          </div>

        </WindowBorderComponent>    
      </div>
    </Fragment>
  );
};

export default WindowComponent;