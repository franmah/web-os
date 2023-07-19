import { FC, useContext, useEffect, useState } from 'react';
import { TaskbarPinnedAppContext } from '../../contexts/TaskbarPinnedAppContext';
import { ProcessContext } from '../../contexts/ProcessContext';
import { ProcessDirectory } from '../../System/process/ProcessDirectory';

export type TaskbarAppType = {
	focused: boolean,
	iconPath: string,
	multipleOpen: boolean,
	name: string,
	pinned: string
};

const TaskbarApps: FC<{}> = () => {

	const pinnedAppContext = useContext(TaskbarPinnedAppContext);
	const processContext = useContext(ProcessContext);

	useEffect(() => {
		// console.log({ pinned: pinnedAppContext.pinnedAppNames });
	}, [pinnedAppContext.pinnedAppNames]);

	useEffect(() => {
		const proccesses = Object
			.values(processContext.processes)
			.filter(process => ProcessDirectory[process.name].owner === 'USER');

		console.log(proccesses.map(p => p.name));
	}, [pinnedAppContext.pinnedAppNames]);

	return (
		<div>bar</div>
	);
};

export default TaskbarApps;
