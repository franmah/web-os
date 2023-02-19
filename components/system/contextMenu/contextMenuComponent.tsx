import { FC } from 'react';
import styles from './contextMenu.module.scss';

const ContextMenuComponent: FC<{}> = ({}) => {
  
  return (
    <section 
      className={styles.contextMenuRoot}
      id="contextMenuRoot"
      style={{
        top: 0,
        left: 0
      }}
    >
    </section>
  );
};

export default ContextMenuComponent;