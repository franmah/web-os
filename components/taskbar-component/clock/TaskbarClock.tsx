import { FC, useEffect, useState } from "react";
import styles from './clock.module.scss';
import globalStyles from '../../../styles/global.module.scss';

const TaskbarClock: FC<{}> = () => {

  const NUM_HOURS = 12;

  let clockSyncInterval: NodeJS.Timer;

  const [date, setDate] = useState<Date>(new Date());

  useEffect(() => {
    clockSyncInterval = setInterval(() => setDate(new Date()), 1000);
    return (() => clearInterval(clockSyncInterval));
  }, []);
  
  const getTime = (): string => {
    const timeOfDay = date.getHours() > NUM_HOURS ? 'PM' : 'AM';
    return `${date.getHours() % NUM_HOURS}:${String(date.getMinutes()).padStart(2, '0')} ${timeOfDay}`;
  }

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