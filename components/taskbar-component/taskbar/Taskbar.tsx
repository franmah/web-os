import { FC } from 'react';
import ShortcutBar from '../shortcut-bar/ShortcutBar';
import styles from './taskbar.module.scss';
import TaskbarClock from '../clock/TaskbarClock';
import WeatherComponent from '../weather/Weather';

const Taskbar: FC<{}> = () => {
	return (
		<nav className={styles.taskbarMain}>
			<WeatherComponent />

			<ShortcutBar />

			<TaskbarClock />
		</nav>
	);
};

export default Taskbar;
