import { FC } from 'react';
import ShortcutBar from './shortcut-bar/ShortcutBar';
import styles from './taskbar.module.scss';
import TaskbarClock from './clock/TaskbarClock';

const Taskbar: FC<{}> = () => {

  return (
    <section className={styles.taskbarMain}>
      
      <div>
        METEO
      </div>

      <div className={styles.appSection}>
        <ShortcutBar />
      </div>

      <TaskbarClock />

    </section>
  );
};

export default Taskbar;