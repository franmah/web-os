import { FC } from "react";
import styles from './clock.module.scss';

const TaskbarClock: FC<{}> = () => {
  
  const formatTime = (date: Date): string => {
    return '';
    // const timeOfDay = date.getHours() > this.NUM_HOURS ? 'PM' : 'AM';
    // return `${date.getHours() % this.NUM_HOURS}:${String(date.getMinutes()).padStart(2, '0')} ${timeOfDay}`;
  }

  const formatDate = (date: Date): string => {
    return '';
    // return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  }

  return (
    <div className={styles.datetime}>
      <div>8:31 PM</div>
      <div>3/2/2023</div>
    </div>
  );
};

export default TaskbarClock;