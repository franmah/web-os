import { FC, Fragment, memo, useEffect, useRef } from "react";
import { WindowMaximize } from "../../../constants/system/window/WindowMaximizeEnum";
import { WindowResizeDirection } from "../../../constants/system/window/WindowResizeDirectionEnum";
import { isEventOriginatedFromWithinTargetIdSubtree } from "../../../services/EventService";
import { maximizeOrRestoreWindow } from "../../../services/system/window/MaximizeRestoreWindowService";
import { moveWindow } from "../../../services/system/window/MoveWindowService";
import { getWindowOptionForCustomMaximize } from "../../../services/system/window/WindowCustomMaximizeOptionService.ts";
import { resizeWindow } from "../../../services/system/window/WindowResizeService";
import { stopMovingAndResizingWindow } from "../../../services/system/window/WindowService";
import { WindowParams } from "../../../types/system/window/WindowProps";
import { WindowState } from "../../../types/system/window/WindowState";
import { CustomMaximizeDirection } from "./maximizeOptionsModal/maximizeOptionsModal";
import styles from './window.module.scss';
import WindowAnimationPlaceholderComponent from "./animationPlaceholder/animationPlaceholder";
import WindowBorderComponent from "./border/windowBorder";
import { WINDOW_SELECTED_ZINDEX, WINDOW_UNSELECTED_ZINDEX } from "../../../constants/Zindex";
import HeaderComponent from "./header/header";

export const WINDOW_MIN_HEIGH = 200; // TODO: move into styles component
export const WINDOW_MIN_WIDTH = 150; // TODO: move into styles component

const WindowComponent: FC<{
  windowParams: WindowParams,
  options: WindowState,
  setOptions: (windowId: string, options: WindowState) => void,
  closeWindow: (windowId: string) => void,
  children: React.ReactNode,
}> = memo(({ windowParams, options, setOptions, closeWindow, children }) => {

  // Needed to so that event listeners can have an up to date reference to the props.
  // Without this, they access the props from the context when the listeners are created which won't be updated.
  // Decided to not completely lift the state up to the window manager so that the logic mainly stays here.
  // Can get rid of useRef by moving the startMoving and other function in the manager and passing them as props.
  const latestOptions = useRef<WindowState>(options);
  useEffect(() => { latestOptions.current = options }, [options]);

  const handleCloseWindow = () => {
    closeWindow(windowParams.windowId);
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
    const updatedOptions = {
      ...latestOptions.current,
      selected: isClickInWindow
    };

    setOptions(windowParams.windowId, updatedOptions);
  };

  const onMouseMove = (event: MouseEvent) => {
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    if (latestOptions.current.moving) {
      return setOptions(windowParams.windowId,
        {
          ...latestOptions.current,
          ...moveWindow(event, latestOptions.current)
        }
      );
    } else if (latestOptions.current.resizeDirection !== WindowResizeDirection.None) {
      return setOptions(windowParams.windowId,
        {
          ...latestOptions.current,
          ...resizeWindow(mouseX, mouseY, latestOptions.current)
        }
      );
    }
  };

  const startMoving = (event: any) => {
    setOptions(windowParams.windowId, {
        ...latestOptions.current,
        moving: true,
        previousClientX: event.clientX,
        previousClientY: event.clientY
    });
  };

  const startResizing = (event: any, direction: WindowResizeDirection) => {
    setOptions(windowParams.windowId, {
      ...options,
      previousClientX: event.clientX,
      previousClientY: event.clientY,
      resizeDirection: direction
    });
  };

  const onMouseUp = (event: MouseEvent) => {
    setOptions(windowParams.windowId, {
      ...latestOptions.current,
      ...stopMovingAndResizingWindow(event.clientX, event.clientY, latestOptions.current)
    });
  };

  const maximizeWindow = (event: any) => {
    setOptions(windowParams.windowId, {
      ...latestOptions.current,
      ...maximizeOrRestoreWindow(latestOptions.current)
    });
  };
  
  const moveToCustomMaximizeOptionClick = (direction: CustomMaximizeDirection) => {
    setOptions(windowParams.windowId, {
      ...latestOptions.current,
      maximized: WindowMaximize.Side,
      ...getWindowOptionForCustomMaximize(direction, window.innerWidth, window.innerHeight)
    });
  };

  const getClass = () => {
    return `${styles.window} ${ latestOptions.current.selected ? styles.windowSelected : styles.windowUnselected}`;
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
          onTopResizeDoubleClick={maximizeWindow}
        >

          <div className={styles.centerContent}>
            <HeaderComponent
              selected={options.selected}
              options={windowParams.headerOptions}
              maximized={options.maximized}
              startMovingWindow={startMoving}
              maximizeWindow={maximizeWindow}
              onClose={handleCloseWindow}
              moveToCustomMaximizeOptionClick={(direction) => moveToCustomMaximizeOptionClick(direction)}
            />

            { children }
          </div>

        </WindowBorderComponent>    
      </div>
    </Fragment>
  );
}, (state1, state2) => {
  try {
    const state1Data = { ...state1.windowParams, ...state1.options };
    const state2Data = { ...state2.windowParams, ...state2.options };
    return JSON.stringify(state1Data) === JSON.stringify(state2Data);
  } catch (error) {
    console.error(`Error with memo() while comparing window ${state1.windowParams.windowId}'s state: ${error}`);
    return false;
  }
});

export default WindowComponent;