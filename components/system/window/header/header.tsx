import { FC } from "react";
import styles from './header.module.scss';

const HeaderComponent: FC<{
  onHeaderMouseDown: (event: any) => void,
  maximizeWindow: (event: any) => void,
}> = ({ onHeaderMouseDown, maximizeWindow }) => {

  return (
    <div
      onMouseDown={onHeaderMouseDown}
      onDoubleClick={maximizeWindow}
      className={styles.header}
    >
    </div>
  )
};

export default HeaderComponent;