import { FC } from 'react';
import TaskbarApps from './TaskbarApps';
import TaskbarClock from './TaskbarClock';
import TaskbarWeather from './TaskbarWeather';
import { StyledTaskbar } from '../../styled-components/system/taskbar/StyledTaskbar';

const Taskbar: FC<{}> = () => {
	return (
		<StyledTaskbar>

			<TaskbarWeather />

			<TaskbarApps />

			<TaskbarClock />

		</StyledTaskbar>
	);
};

export default Taskbar;
