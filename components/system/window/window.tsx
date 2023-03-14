import { FC, Fragment, useContext, useEffect, useState } from "react";
import { DEFAULT_WINDOW_STATE } from "../../../constants/system/window/WindowConsts";
import { WindowMaximize } from "../../../constants/system/window/WindowMaximizeEnum";
import { WindowResizeDirection } from "../../../constants/system/window/WindowResizeDirectionEnum";
import { WINDOW_SELECTED_ZINDEX, WINDOW_UNSELECTED_ZINDEX } from "../../../constants/Zindex";
import { ProcessContext } from "../../../contexts/processContext";
import { isEventOriginatedFromWithinTargetIdSubtree } from "../../../services/EventService";
import { maximizeOrRestoreWindow } from "../../../services/system/window/MaximizeRestoreWindowService";
import { moveWindow } from "../../../services/system/window/MoveWindowService";
import { getWindowOptionForCustomMaximize } from "../../../services/system/window/WindowCustomMaximizeOptionService.ts";
import { resizeWindow } from "../../../services/system/window/WindowResizeService";
import { stopMovingAndResizingWindow } from "../../../services/system/window/WindowService";
import { WindowProps } from "../../../types/system/window/WindowProps";
import { WindowState } from "../../../types/system/window/WindowState";
import WindowAnimationPlaceholderComponent from "./animationPlaceholder/animationPlaceholder";
import WindowBorderComponent from "./border/windowBorder";
import HeaderComponent from "./header/header";
import { CustomMaximizeDirection } from "./maximizeOptionsModal/maximizeOptionsModal";
import styles from './window.module.scss';

export const WINDOW_MIN_HEIGH = 200; // TODO: move into styles component
export const WINDOW_MIN_WIDTH = 150; // TODO: move into styles component

const WindowComponent: FC<{
  windowParams: WindowProps,
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
    const isClickInWindow = isEventOriginatedFromWithinTargetIdSubtree(event, windowParams.windowId);
    setOptions(currentOptions => ({
      ...currentOptions,
      selected: isClickInWindow
    }));
  };

  const startMoving = (event: any) => {
    setOptions(state => {     
      return {
        ...state,
        moving: true,
        previousClientX: event.clientX,
        previousClientY: event.clientY
      };
    });
  };

  const startResizing = (event: any, direction: WindowResizeDirection) => {
    setOptions(state => ({
      ...state,
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
      } else if (options.resizeDirection !== WindowResizeDirection.None) {
        return resizeWindow(mouseX, mouseY, options);
      }
      return options;
    });
  };

  const onMouseUp = (event: MouseEvent) => {
    setOptions(options => {
     return stopMovingAndResizingWindow(event.clientX, event.clientY, options);
    });
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
        placeholderDirection={options.showMaximizePlacehodler}
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
          zIndex: options.selected ? WINDOW_SELECTED_ZINDEX : WINDOW_UNSELECTED_ZINDEX
        }}
      >

        <WindowBorderComponent
          allowResize={options.maximized !== WindowMaximize.Full && !options.moving}
          isResizing={options.resizeDirection !== WindowResizeDirection.None}
          onBordersMouseDown={startResizing}
        >

          <div className={styles.centerContent}>
            <HeaderComponent
              selected={options.selected}
              options={windowParams.headerOptions}
              maximized={options.maximized}
              startMovingWindow={startMoving}
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