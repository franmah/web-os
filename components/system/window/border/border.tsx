import { FC } from "react";
import { WindowResizeDirection } from "../window";
import styles from './border.module.scss';

const WindowBorderComponent: FC<{
  onBordersMouseDown: (event: any, direction: WindowResizeDirection) => void,
  children: React.ReactNode,
}> = ({ onBordersMouseDown, children }) => {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/*  TOP BORDER */}
      <div className={styles.topBorderHeader}>
        <div
          className={styles.topLeft}
          onMouseDown={event => onBordersMouseDown(event, WindowResizeDirection.TopLeft)}>
        </div>
        <div 
          className={styles.topBorder} 
          onMouseDown={event => onBordersMouseDown(event, WindowResizeDirection.Top)}>
        </div>

        <div
          className={styles.topRight}
          onMouseDown={event => onBordersMouseDown(event, WindowResizeDirection.TopRight)}>
        </div>
      </div>

      {/*  LEFT + RIGHT BORDERS + CONTENT */}
      <div className={styles.center}>
        <div
          className={styles.centerLeft}
          onMouseDown={event => onBordersMouseDown(event, WindowResizeDirection.Left)}>
        </div>

        { children }

        <div
          className={styles.centerRight}
          onMouseDown={event => onBordersMouseDown(event, WindowResizeDirection.Right)}>
        </div>
      </div>

      {/*  BOTTOM BORDER */}
      <div className={styles.bottomHeaderBorder}>
        
        <div
          className={styles.bottomLeft}
          onMouseDown={event => onBordersMouseDown(event, WindowResizeDirection.BottomLeft)}>
        </div>
        <div
          className={styles.bottomBorder}
          onMouseDown={event => onBordersMouseDown(event, WindowResizeDirection.Bottom)}>
        </div>
        <div
          className={styles.bottomRight}
          onMouseDown={event => onBordersMouseDown(event, WindowResizeDirection.BottomRight)}>
        </div>
      </div>
    </div>
      
  );
};

export default WindowBorderComponent;