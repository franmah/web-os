import { FC } from "react";
import { WindowResizeDirection } from "../../../../constants/system/window/WindowResizeDirectionEnum";
import { StyledWindowBorderComponent } from "../../../../styled-components/system/window/StyledWindowBorderComponentContainer";

const WindowBorderComponent: FC<{
  allowResize: boolean,
  isResizing: boolean,
  zIndex: number,
  onBordersMouseDown: (event: any, direction: WindowResizeDirection) => void,
  onTopResizeDoubleClick: (event: any) => void,
  children: React.ReactNode,
}> = ({ allowResize, isResizing, onBordersMouseDown, onTopResizeDoubleClick, children, zIndex }) => {

  return (
    <StyledWindowBorderComponent
      resizing={isResizing}
      zIndex={zIndex}
    >
      {/*  TOP BORDER */}
      <div
        className={allowResize ? 'topBorder' : ''}
      >
        <div
          className={'topLeft'}
          onMouseDown={event => onBordersMouseDown(event, WindowResizeDirection.TopLeft)}>
        </div>
        
        <div 
          className={'top'}
          onMouseDown={event => onBordersMouseDown(event, WindowResizeDirection.Top)}
          onDoubleClick={onTopResizeDoubleClick}>
        </div>

        <div
          className={'topRight'}
          onMouseDown={event => onBordersMouseDown(event, WindowResizeDirection.TopRight)}>
        </div>
      </div>

      {/*  LEFT + RIGHT BORDERS + CONTENT */}
      <div
        className={allowResize ? 'centerLeft' : ''}
      >
          <div className={'leftCenterTop'} 
            onMouseDown={event => onBordersMouseDown(event, WindowResizeDirection.TopLeft)}
          ></div>
          <div className={'leftCenterMiddle'}
            onMouseDown={event => onBordersMouseDown(event, WindowResizeDirection.Left)}
          ></div>
          <div className={'leftCenterBottom'}
            onMouseDown={event => onBordersMouseDown(event, WindowResizeDirection.BottomLeft)}
          ></div>
      </div>

      {/* CHILDREN */}
      <div className={'children'}>{ children }</div>

      <div
        className={allowResize ? 'centerRight' : ''}
      >
        <div className={'rightCenterTop'}
          onMouseDown={event => onBordersMouseDown(event, WindowResizeDirection.TopRight)}
        ></div>
        <div className={'rightCenterMiddle'}
          onMouseDown={event => onBordersMouseDown(event, WindowResizeDirection.Right)}
        ></div>
        <div className={'rightCenterBottom'}
          onMouseDown={event => onBordersMouseDown(event, WindowResizeDirection.BottomRight)}
        ></div>
      </div>

      {/*  BOTTOM BORDER */}
      <div
        className={allowResize ? 'bottomBorder' : ''}
      >
        
        <div
          className={'bottomLeft'}
          onMouseDown={event => onBordersMouseDown(event, WindowResizeDirection.BottomLeft)}>
        </div>
        <div
          className={'bottom'}
          onMouseDown={event => onBordersMouseDown(event, WindowResizeDirection.Bottom)}>
        </div>
        <div
          className={'bottomRight'}
          onMouseDown={event => onBordersMouseDown(event, WindowResizeDirection.BottomRight)}>
        </div>
      </div>
    </StyledWindowBorderComponent>
  );
};

export default WindowBorderComponent;