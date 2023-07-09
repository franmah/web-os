import { FC, useEffect, useState } from 'react';
import styles from './clock.module.scss';
import globalStyles from '../../../styles/global.module.scss';

const TaskbarClock: FC<{}> = () => {

  const NUM_HOURS = 12;
  const CLOCK_REFRESH_RATE = 1000;

  const [date, setDate] = useState<Date>(new Date());

  useEffect(() => {
    const clockSyncInterval = setInterval(() => setDate(new Date()), CLOCK_REFRESH_RATE);
    return (() => clearInterval(clockSyncInterval));
  }, []);

  const getTime = (): string => {
    const timeOfDay = date.getHours() >= NUM_HOURS ? 'PM' : 'AM';
    const hour = date.getHours() > NUM_HOURS ? date.getHours() % NUM_HOURS : date.getHours();
    return `${hour}:${String(date.getMinutes()).padStart(2, '0')} ${timeOfDay}`;
  };

  const getDate = (): string => {
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  };

  return (
    <div className={`${styles.datetime} ${globalStyles.unselectableText}`}>
      <div>{getTime()}</div>
      <div>{getDate()}</div>
    </div>
  );
};

export default TaskbarClock;