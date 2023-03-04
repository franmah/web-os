import { FC } from 'react';
import ShortcutBar from '../shortcut-bar/ShortcutBar';
import styles from './taskbar.module.scss';
import TaskbarClock from '../clock/TaskbarClock';
import WeatherComponent from '../weather/weatherTaskabar';

const Taskbar: FC<{}> = () => {

  return (
    <section className={styles.taskbarMain}>
      
      <WeatherComponent />

      <ShortcutBar />

      <TaskbarClock />

    </section>
  );
};

export default Taskbar;