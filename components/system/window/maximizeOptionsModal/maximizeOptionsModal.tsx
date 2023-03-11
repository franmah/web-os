import { FC, memo } from "react";
import styles from './maximize-options.module.scss';

export enum CustomMaximizeDirection {
  Left, Right, LargerLeft, SmallerRight, TopRight, TopLeft, BottomRight, BottomLeft
};

const MaximizeOptionsModalComponent: FC<{
  onCustomMaximizeClick: (direction: CustomMaximizeDirection) => void
}> = memo(({ onCustomMaximizeClick }) => {

  return (
    <div className={styles.main}>

      <div className={styles.topLeft}>
        <div className={`${styles.left} ${styles.item}`}
          onClick={() => onCustomMaximizeClick(CustomMaximizeDirection.Left)}>
        </div>
        <div className={`${styles.right} ${styles.item}`}
          onClick={() => onCustomMaximizeClick(CustomMaximizeDirection.Right)}>
        </div>
      </div>

      <div className={styles.topRight}>
        <div className={`${styles.left} ${styles.item}`}
          onClick={() => onCustomMaximizeClick(CustomMaximizeDirection.LargerLeft)}>
        </div>
        <div className={`${styles.right} ${styles.item}`}
          onClick={() => onCustomMaximizeClick(CustomMaximizeDirection.SmallerRight)}>
        </div>
      </div>

      
      <div className={styles.bottomLeft}>
        <div className={`${styles.left} ${styles.item}`}
          onClick={() => onCustomMaximizeClick(CustomMaximizeDirection.Left)}>
        </div>
        <div className={`${styles.top} ${styles.item}`}
          onClick={() => onCustomMaximizeClick(CustomMaximizeDirection.TopRight)}>
        </div>
        <div className={`${styles.bottom} ${styles.item}`}
          onClick={() => onCustomMaximizeClick(CustomMaximizeDirection.BottomRight)}>
        </div>
      </div>

      <div className={styles.bottomRight}>
        <div className={`${styles.topLeft} ${styles.item}`}
          onClick={() => onCustomMaximizeClick(CustomMaximizeDirection.TopLeft)}>
        </div>
        <div className={`${styles.topRight} ${styles.item}`}
        onClick={() => onCustomMaximizeClick(CustomMaximizeDirection.TopRight)}>
      </div>
        <div className={`${styles.bottomLeft} ${styles.item}`}
        onClick={() => onCustomMaximizeClick(CustomMaximizeDirection.BottomLeft)}>
      </div>
        <div className={`${styles.bottomRight} ${styles.item}`}
        onClick={() => onCustomMaximizeClick(CustomMaximizeDirection.BottomRight)}>
      </div>
      </div>
    
    </div>
  );
}, () => true);

export default MaximizeOptionsModalComponent;