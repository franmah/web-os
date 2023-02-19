import { FC } from 'react';
import styles from './contextMenu.module.scss';

const ContextMenuComponent: FC<{ params: string }> = ({ params }) => {
  return (
    <section 
      className={styles.contextMenuRoot}
      id="contextMenuRoot"
      style={{
        top: 0,
        left: 0
      }}
    >
      <p style={{ color: 'white' }}>{ params } test</p>
    </section>
  );
};

export default ContextMenuComponent;