import { FC } from "react";
import { WindowResizeDirection } from "../window";
import styles from './border.module.scss';

const WindowBorderComponent: FC<{
  allowResize: boolean,
  isResizing: boolean,
  onBordersMouseDown: (event: any, direction: WindowResizeDirection) => void,
  children: React.ReactNode,
}> = ({ allowResize, isResizing, onBordersMouseDown, children }) => {

  const getClass = (direction: string) => {
    if (!allowResize){
      return '';
    }

    console.log(isResizing)

    switch (direction) {
      case 'top': return styles.topBorder + ' ' + (!isResizing && styles.topBorderHover);
      case 'topLeft': return styles.topLeft + ' ' + (!isResizing && styles.topLeftHover);
      case 'topRight': return styles.topRight + ' ' + (!isResizing && styles.topRightHover);
      case 'bottom': return styles.bottom + ' ' + (!isResizing && styles.bottomHover);
      case 'bottomLeft': return styles.bottomLeft + ' ' + (!isResizing && styles.bottomLeftHover);
      case 'bottomRight': return styles.bottomRight + ' ' + (!isResizing && styles.bottomRightHover);
      case 'leftCenterTop': return styles.leftCenterTop + ' ' + (!isResizing && styles.leftCenterTopHover);
      case 'leftCenterMiddle': return styles.leftCenterMiddle + ' ' + (!isResizing && styles.leftCenterMiddleHover);
      case 'leftCenterBottom': return styles.leftCenterBottom + ' ' + (!isResizing && styles.leftCenterBottomHover);
      case 'rightCenterTop' : return styles.rightCenterTop + ' ' + (!isResizing && styles.rightCenterTopHover);
      case 'rightCenterMiddle' : return styles.rightCenterMiddle + ' ' + (!isResizing && styles.rightCenterMiddleHover);
      case 'rightCenterBottom' : return styles.rightCenterBottom + ' ' + (!isResizing && styles.rightCenterBottomHover);
      default: return '';
    }
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
      }}
    >
      {/*  TOP BORDER */}
      <div className={styles.topBorderHeader}>
        <div
          className={getClass('topLeft')}
          onMouseDown={event => onBordersMouseDown(event, WindowResizeDirection.TopLeft)}>
        </div>
        
        <div 
          className={getClass('top')}
          onMouseDown={event => onBordersMouseDown(event, WindowResizeDirection.Top)}>
        </div>

        <div
          className={getClass('topRight')}
          onMouseDown={event => onBordersMouseDown(event, WindowResizeDirection.TopRight)}>
        </div>
      </div>

      {/*  LEFT + RIGHT BORDERS + CONTENT */}
      <div
        className={styles.centerLeft}
      >
          <div className={getClass('leftCenterTop')} 
            onMouseDown={event => onBordersMouseDown(event, WindowResizeDirection.TopLeft)}
          ></div>
          <div className={getClass('leftCenterMiddle')}
            onMouseDown={event => onBordersMouseDown(event, WindowResizeDirection.Left)}
          ></div>
          <div className={getClass('leftCenterBottom')}
            onMouseDown={event => onBordersMouseDown(event, WindowResizeDirection.BottomLeft)}
          ></div>
      </div>

      {/* CHILDREN */}
      <div className={styles.children}>{ children }</div>

      <div
        className={styles.centerRight}
      >
        <div className={getClass('rightCenterTop')}
          onMouseDown={event => onBordersMouseDown(event, WindowResizeDirection.TopRight)}
        ></div>
        <div className={getClass('rightCenterMiddle')}
          onMouseDown={event => onBordersMouseDown(event, WindowResizeDirection.Right)}
        ></div>
        <div className={getClass('rightCenterBottom')}
          onMouseDown={event => onBordersMouseDown(event, WindowResizeDirection.BottomRight)}
        ></div>
      </div>

      {/*  BOTTOM BORDER */}
      <div className={styles.bottomBorder}>
        
        <div
          className={getClass('bottomLeft')}
          onMouseDown={event => onBordersMouseDown(event, WindowResizeDirection.BottomLeft)}>
        </div>
        <div
          className={getClass('bottom')}
          onMouseDown={event => onBordersMouseDown(event, WindowResizeDirection.Bottom)}>
        </div>
        <div
          className={getClass('bottomRight')}
          onMouseDown={event => onBordersMouseDown(event, WindowResizeDirection.BottomRight)}>
        </div>
      </div>
    </div>
      
  );
};

export default WindowBorderComponent;