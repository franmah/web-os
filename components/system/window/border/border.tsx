import { FC } from "react";
import { WindowResizeDirection } from "../window";
import styles from './border.module.scss';

const WindowBorderComponent: FC<{
  allowResize: boolean,
  onBordersMouseDown: (event: any, direction: WindowResizeDirection) => void,
  children: React.ReactNode,
}> = ({ allowResize, onBordersMouseDown, children }) => {

  const getClass = (direction: string) => {
    if (!allowResize){
      return '';
    }

    switch (direction) {
      case 'top': return styles.topBorder;
      case 'topLeft': return styles.topLeft;
      case 'topRight': return styles.topRight
      case 'centerLeft': return styles.centerLeft;
      case 'centerRight': return styles.centerRight;
      case 'bottom': return styles.bottom;
      case 'bottomLeft': return styles.bottomLeft;
      case 'bottomRight': return styles.bottomRight;
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
        className={getClass('centerLeft')}
      >
          <div className={styles.leftCenterTop} 
            onMouseDown={event => onBordersMouseDown(event, WindowResizeDirection.TopLeft)}
          ></div>
          <div className={styles.leftCenterMiddle}
            onMouseDown={event => onBordersMouseDown(event, WindowResizeDirection.Left)}
          ></div>
          <div className={styles.leftCenterBottom}
            onMouseDown={event => onBordersMouseDown(event, WindowResizeDirection.BottomLeft)}
          ></div>
      </div>

      {/* CHILDREN */}
      <div className={styles.children}>{ children }</div>

      <div
        className={getClass('centerRight')}
      >
        <div className={styles.rightCenterTop}
          onMouseDown={event => onBordersMouseDown(event, WindowResizeDirection.TopRight)}
        ></div>
        <div className={styles.rightCenterMiddle}
          onMouseDown={event => onBordersMouseDown(event, WindowResizeDirection.Right)}
        ></div>
        <div className={styles.rightCenterBottom}
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