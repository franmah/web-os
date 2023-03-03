import { FC } from 'react';
import Image from 'next/image';
import ShortcutBar from './shortcut-bar/ShortcutBar';
import styles from './taskbar.module.scss';
import globalStyles from '../../styles/global.module.scss';
import TaskbarClock from './clock/TaskbarClock';

const Taskbar: FC<{}> = () => {

  return (
    <section className={styles.taskbarMain}>
      
      <div>
        METEO
      </div>

      <div className={styles.appSection}>
        
        <div className={`${styles.windowIcon} ${globalStyles.unselectableText}`}>
          <Image src='/taskbar/windows-logo.png' alt='menu' height={22} width={22}/>
        </div>

        <ShortcutBar />
      </div>

      <TaskbarClock />

    </section>
  );
};

export default Taskbar;