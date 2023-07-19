import { FC } from 'react';
import TaskbarApps from './TaskbarApps';
import TaskbarClock from './TaskbarClock';
import TaskbarWeather from './TaskbarWeather';
import styled from 'styled-components';
import { TASKBAR_HEIGHT_PX } from '../../constants/Taskbar';

export const StyledTaskbar = styled.nav`
	position: absolute;
	z-index: 1000;
	bottom: 0;
	left: 0;
	width: 100%;
	height: ${TASKBAR_HEIGHT_PX};
	background-color: #EEEEEE;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 2px 0px;
`;

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