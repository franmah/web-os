import { FC, useContext, useEffect, useState } from 'react';
import { TaskbarPinnedAppContext } from '../../contexts/TaskbarPinnedAppContext';
import { ProcessContext } from '../../contexts/ProcessContext';
import { ProcessDirectory } from '../../System/process/ProcessDirectory';
import { IconPaths } from '../../constants/IconPaths';

export type TaskbarAppType = {
	focused: boolean,
	iconPath: string,
	multipleOpen: boolean,
	name: string,
	pinned: boolean
};

const TaskbarApps: FC<{}> = () => {

	const [apps, setApps] = useState<TaskbarAppType[]>([]);

	const pinnedAppContext = useContext(TaskbarPinnedAppContext);
	const processContext = useContext(ProcessContext);

	// useEffect(() => {
	// 	console.log(apps);
	// }, [apps]);

	useEffect(() => {
		// console.log({ pinned: pinnedAppContext.pinnedAppNames });
		setApps(apps => {
			for (const pinnedAppName of pinnedAppContext.pinnedAppNames) {
				const matchingApp = apps.find(app => app.name === pinnedAppName);
				if (matchingApp) {
					matchingApp.pinned = true;
				} else {
					apps.push({
						focused: false,
						iconPath: ProcessDirectory[pinnedAppName].iconPath || IconPaths.UNKOWN_EXTENSION,
						multipleOpen: false,
						name: pinnedAppName,
						pinned: true
					});
				}
			}

			return [...apps];
		});
	}, [pinnedAppContext.pinnedAppNames]);

	useEffect(() => {
		const processes = Object
			.values(processContext.processes)
			.filter(process => ProcessDirectory[process.name].owner === 'USER');

		const processCount: { [processName: string]: number } = {};
		processes.forEach(({ name }) => processCount[name] ? processCount[name] += 1 : processCount[name] = 1 );

		setApps(apps => {
			for (const process of processes) {
				const matchingApp = apps.find(app => app.name === process.name);
				if (matchingApp) {
					matchingApp.multipleOpen = processCount[process.name] > 1;
				} else {
					apps.push({
						focused: false,
						iconPath: ProcessDirectory[process.name].iconPath || IconPaths.UNKOWN_EXTENSION,
						multipleOpen: false,
						name: process.name,
						pinned: true
					});
				}
			}

			return [...apps];
		});

	}, [processContext.processes]);

	return (
		<div>bar</div>
	);
};

export default TaskbarApps;
