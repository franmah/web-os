import { FC } from 'react';
import styles from './shortcut.module.scss';

const TaskbarShortcut: FC<any> = ({ children }) => (

  <div className={styles.shortcut}>
    {children}
  </div>
);

export default TaskbarShortcut;