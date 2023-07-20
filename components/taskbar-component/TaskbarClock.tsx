import { FC, useEffect, useState } from 'react';
import globalStyles from '../../styles/global.module.scss';
import styled from 'styled-components';

export const StyledTaskbarClock = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	height: 100%;
	align-items: flex-end;
	font-size: 12px;
	text-align: center;
	color: black;
	padding: 0px 8px;
	margin-right: 8px;

	border: 1px solid transparent;
	border-radius: 4px;
	
	&:hover {
		background-color: #f8f8f8;
		border-radius: 4px;
    border: 1px solid #E9E9E9;
		cursor: default;
	}
`;

const TaskbarClock: FC<{}> = () => {
	const NUM_HOURS = 12;
	const CLOCK_REFRESH_RATE = 1000;

	const [date, setDate] = useState<Date>(new Date());

	useEffect(() => {
		const clockSyncInterval = setInterval(() => setDate(new Date()), CLOCK_REFRESH_RATE);
		return () => clearInterval(clockSyncInterval);
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
		<StyledTaskbarClock className={globalStyles.unselectableText}>
			<div>{getTime()}</div>
			<div>{getDate()}</div>
		</StyledTaskbarClock>
	);
};

export default TaskbarClock;
