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
  windowParams: WindowProps, //TODO: change type
  windowState: WindowState,
  windowId: string,
  updateState: (windowId: string, state: Partial<WindowState>, origin?: string) => void,
  children: React.ReactNode
}> = ({ windowParams, windowId, windowState, updateState, children }) => {
  // console.log(windowId)
  console.log({ windowState })

  const { closeProcess } = useContext(ProcessContext); // TODO: the window manager state will be messed up.

  // const [options, setOptions] = useState<WindowState>({
  //   ...DEFAULT_WINDOW_STATE
  // });

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
    updateState(windowId, {
      selected: isClickInWindow
    }, 'onDocumentMouseDOwn');
  };

  const startMoving = (event: any) => {
    updateState(windowId, {
      moving: true,
      previousClientX: event.clientX,
      previousClientY: event.clientY
    }, 'start moving');
  };

  const startResizing = (event: any, direction: WindowResizeDirection) => {
    updateState(windowId, {
      previousClientX: event.clientX,
      previousClientY: event.clientY,
      resizeDirection: direction
    }, 'startResizing');
  };

  const onMouseMove = (event: MouseEvent) => {
    const mouseX = event.clientX;
    const mouseY = event.clientY;
    if (windowState.moving) {
     updateState(windowId, moveWindow(event, windowState), 'monMouseMove');
    } else if (windowState.resizeDirection !== WindowResizeDirection.None) {
      updateState(windowId, resizeWindow(mouseX, mouseY, windowState), 'onMouseMove');
    }
  };

  const onMouseUp = (event: MouseEvent) => {
    updateState(windowId,
      stopMovingAndResizingWindow(event.clientX, event.clientY, windowState), 'onMouseUp');
  };

  const maximizeWindow = (event: any) => {
    updateState(windowId, maximizeOrRestoreWindow(windowState), 'maximizeWindow');
  };

  
  const moveToCustomMaximizeOptionClick = (direction: CustomMaximizeDirection) => {
    updateState(windowId, {
      ...windowState,
      maximized: WindowMaximize.Side,
      ...getWindowOptionForCustomMaximize(direction, window.innerWidth, window.innerHeight)
    }, 'moveToCusomtMaximize');
  };

  const getClass = () => {
    return `${styles.window} ${ windowState.selected ? styles.windowSelected : styles.windowUnselected}`;
  };

  return (
    <Fragment>
      <WindowAnimationPlaceholderComponent
        placeholderDirection={windowState.showMaximizePlacehodler}
        top={windowState.top}
        left={windowState.left}
        width={windowState.width}
        height={windowState.height}
      />

      <div
        id={windowParams.windowId}
        className={getClass()}
        style={{
          top: windowState.top,
          left: windowState.left,
          width: `${windowState.width}px`,
          height: `${windowState.height}px`,
          zIndex: windowState.selected ? WINDOW_SELECTED_ZINDEX : WINDOW_UNSELECTED_ZINDEX
        }}
      >

        <WindowBorderComponent
          allowResize={windowState.maximized !== WindowMaximize.Full && !windowState.moving}
          isResizing={windowState.resizeDirection !== WindowResizeDirection.None}
          onBordersMouseDown={startResizing}
        >

          <div className={styles.centerContent}>
            <HeaderComponent
              selected={windowState.selected}
              options={windowParams.headerOptions}
              maximized={windowState.maximized}
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