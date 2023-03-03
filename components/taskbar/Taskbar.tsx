import { FC } from 'react';
import Image from 'next/image';
import ShortcutBar from './shortcut-bar/ShortcutBar';
import styles from './taskbar.module.scss';
import globalStyles from '../../styles/global.module.scss';
import TaskbarClock from './clock/TaskbarClock';

const Taskbar: FC<{}> = () => {

  return (
    <div className={styles.taskbarMain}>
      <div className={`${styles.windowIcon} ${globalStyles.unselectableText}`}>
        <Image src='/taskbar/windows-logo.png' alt='menu' height={22} width={22}/>
      </div>

      <ShortcutBar />

      <TaskbarClock />
    </div>
  );
};

export default Taskbar;