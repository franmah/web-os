import { FC, Fragment, useEffect } from "react";
import { WindowMaximize } from "../../../constants/system/window/WindowMaximizeEnum";
import { WindowResizeDirection } from "../../../constants/system/window/WindowResizeDirectionEnum";
import { WindowParams } from "../../../types/system/window/WindowProps";
import { WindowState } from "../../../types/system/window/WindowState";
import WindowAnimationMaximizePlaceholderComponent from "./animationPlaceholder/animationPlaceholder";
import WindowBorderComponent from "./border/windowBorder";
import WindowHeaderComponent from "./header/header";
import { CustomMaximizeDirection } from "../../../constants/system/window/CustomMaximizeDirectionEnum";
import { zIndexConsts } from "../../../constants/Zindex";
import { StyledWindow } from "../../../styled-components/system/window/StyledWindow";

export const WINDOW_MIN_HEIGH = 200; // TODO: move into styles component
export const WINDOW_MIN_WIDTH = 150; // TODO: move into styles component

const WindowComponent: FC<{
  windowParams: WindowParams,
  state: WindowState,
  closeWindow: (windowId: string) => void,
  handleWindowMouseDown : (windowId: string) => void,
  hanldeMouseMove : (windowId: string, event: MouseEvent) => void,
  handleStartMoving : (windowId: string, event: MouseEvent) => void,
  handleStartResizing : (windowId: string, event: MouseEvent, direction: WindowResizeDirection) => void,
  handleMouseUp : (windowId: string, event: MouseEvent) => void,
  handleMaximize : (windowId: string) => void,
  handleMoveToCustomMaximizeOptionClick : (windowId: string, direction: CustomMaximizeDirection) => void,
  handleHeightMaximize: (windowId: string) => void,
  children: React.ReactNode
}> = ({
  windowParams,
  state,
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

  return (
    <Fragment>
      <WindowAnimationMaximizePlaceholderComponent
        placeholderDirection={state.showMaximizePlacehodler}
        top={state.top}
        left={state.left}
        width={state.width}
        height={state.height}
        zIndex={state.zIndex - zIndexConsts.windowComponent.animationPlaceholderOffset}
      />

      <StyledWindow
        id={windowParams.windowId}
        onMouseDown={() => handleWindowMouseDown(windowParams.windowId)}
        focused={state.focused}
        top={state.top}
        left={state.left}
        width={state.width}
        height={state.height}
        zIndex={state.zIndex}
      >

        <WindowBorderComponent
          allowResize={state.maximized !== WindowMaximize.Full && !state.moving}
          isResizing={state.resizeDirection !== WindowResizeDirection.None}
          onBordersMouseDown={(e, direction) => handleStartResizing(windowParams.windowId, e, direction)}
          onTopResizeDoubleClick={() => handleHeightMaximize(windowParams.windowId)}
          zIndex={state.zIndex + zIndexConsts.windowComponent.borderComponentOffset}
        >

          <div className={'centerContent'}>

            {/* Header container */}
            {/* Either move that div into StyledComponentContainer, or Create the styled component directly? */}
            <div
              style={{
                width: '100%',
                height: '25px'
              }}
            >
              <WindowHeaderComponent
                focused={state.focused}
                options={windowParams.headerOptions}
                maximized={state.maximized}
                startMovingWindow={(e) => handleStartMoving(windowParams.windowId, e)}
                maximizeWindow={() => handleMaximize(windowParams.windowId)}
                onClose={handleCloseWindow}
                moveToCustomMaximizeOptionClick={(direction) => handleMoveToCustomMaximizeOptionClick(windowParams.windowId, direction)}
              />
            </div>
            

            { children }
            
          </div>

        </WindowBorderComponent>    
      </StyledWindow>
    </Fragment>
  );
};

export default WindowComponent;