import { FC, Fragment, useEffect } from "react";
import { WindowMaximize } from "../../../constants/system/window/WindowMaximizeEnum";
import { WindowResizeDirection } from "../../../constants/system/window/WindowResizeDirectionEnum";
import { WindowParams } from "../../../types/system/window/WindowProps";
import { WindowState } from "../../../types/system/window/WindowState";
import { CustomMaximizeDirection } from "./maximizeOptionsModal/maximizeOptionsModal";
import styles from './window.module.scss';
import WindowAnimationPlaceholderComponent from "./animationPlaceholder/animationPlaceholder";
import WindowBorderComponent from "./border/windowBorder";
import HeaderComponent from "./header/header";

export const WINDOW_MIN_HEIGH = 200; // TODO: move into styles component
export const WINDOW_MIN_WIDTH = 150; // TODO: move into styles component

const WindowComponent: FC<{
  windowParams: WindowParams,
  options: WindowState,
  closeWindow: (windowId: string) => void,
  handleWindowMouseDown : (windowId: string) => void,
  hanldeMouseMove : (windowId: string, event: MouseEvent) => void,
  handleStartMoving : (windowId: string, event: MouseEvent) => void,
  handleStartResizing : (windowId: string, event: MouseEvent, direction: WindowResizeDirection) => void,
  handleMouseUp : (windowId: string, event: MouseEvent) => void,
  handleMaximize : (windowId: string, event: MouseEvent) => void,
  handleMoveToCustomMaximizeOptionClick : (windowId: string, direction: CustomMaximizeDirection) => void,
  handleHeightMaximize: (windowId: string) => void,
  children: React.ReactNode
}> = ({
  windowParams,
  options,
  closeWindow,
  handleWindowMouseDown,
  hanldeMouseMove,
  handleStartMoving,
  handleStartResizing,
  handleMouseUp,
  handleMaximize,
  handleMoveToCustomMaximizeOptionClick,
  handleHeightMaximize,
  children
}) => {

  const handleCloseWindow = () => {
    closeWindow(windowParams.windowId);
  };

  useEffect(() => {
    // Listener on document otherwise window stops updating if mouse moves out of it (if user moves mouse too fast)
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mousemove', onMouseMove);

    return () => {
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mousemove', onMouseMove);
    }
  }, []);

  const onMouseMove = (event: MouseEvent) => {
    hanldeMouseMove(windowParams.windowId, event);
    
  };

  const onMouseUp = (event: MouseEvent) => {
    handleMouseUp(windowParams.windowId, event);
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
        zIndex={options.zIndex}
      />

      <div
        id={windowParams.windowId}
        className={getClass()}
        onMouseDown={() => handleWindowMouseDown(windowParams.windowId)}
        style={{
          top: options.top,
          left: options.left,
          width: `${options.width}px`,
          height: `${options.height}px`,
          zIndex: options.zIndex
        }}
      >

        <WindowBorderComponent
          allowResize={options.maximized !== WindowMaximize.Full && !options.moving}
          isResizing={options.resizeDirection !== WindowResizeDirection.None}
          onBordersMouseDown={(e, direction) => handleStartResizing(windowParams.windowId, e, direction)}
          onTopResizeDoubleClick={() => handleHeightMaximize(windowParams.windowId)}
        >

          <div className={styles.centerContent}>
            <HeaderComponent
              selected={options.selected}
              options={windowParams.headerOptions}
              maximized={options.maximized}
              startMovingWindow={(e) => handleStartMoving(windowParams.windowId, e)}
              maximizeWindow={(e) => handleMaximize(windowParams.windowId, e)}
              onClose={handleCloseWindow}
              moveToCustomMaximizeOptionClick={(direction) => handleMoveToCustomMaximizeOptionClick(windowParams.windowId, direction)}
            />

            { children }
            
          </div>

        </WindowBorderComponent>    
      </div>
    </Fragment>
  );
};

export default WindowComponent;