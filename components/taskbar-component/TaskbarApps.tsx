import { FC, useContext, useEffect, useState } from 'react';
import { TaskbarPinnedAppContext } from '../../contexts/TaskbarPinnedAppContext';
import { ProcessContext } from '../../contexts/ProcessContext';
import { ProcessDirectory } from '../../System/process/ProcessDirectory';
import { IconPaths } from '../../constants/IconPaths';
import { mergeOpenProcessToApps, mergePinnedAppsToApps } from '../../services/system/taskbar/TaskbarAppService';

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
		setApps(apps => {
			return mergePinnedAppsToApps(apps, pinnedAppContext.pinnedAppNames);
		});
	}, [pinnedAppContext.pinnedAppNames]);

	useEffect(() => {
		setApps(apps => {
			return mergeOpenProcessToApps(apps, processContext.processes);
		});
	}, [processContext.processes]);

	return (
		<div>bar</div>
	);
};

export default TaskbarApps;
