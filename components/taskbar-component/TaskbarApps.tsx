import { FC, useContext, useEffect, useState } from 'react';
import { TaskbarPinnedAppContext } from '../../contexts/TaskbarPinnedAppContext';
import { ProcessContext } from '../../contexts/ProcessContext';
import { mergeOpenProcessToApps, mergePinnedAppsToApps } from '../../services/system/taskbar/TaskbarAppService';
import { TaskbarApp } from './TaskbarApp';
import styled from 'styled-components';

export type TaskbarAppType = {
	focused: boolean,
	iconPath: string,
	multipleOpen: boolean,
	name: string,
	pinned: boolean,
	open: boolean
};

export const StyledTaskbarApps = styled.section`
	display: flex;
	align-items: center;
	justify-content: center;

	height: 100%;
`;

const TaskbarApps: FC<{}> = () => {

	const [apps, setApps] = useState<TaskbarAppType[]>([]);

	const pinnedAppContext = useContext(TaskbarPinnedAppContext);
	const processContext = useContext(ProcessContext);

	useEffect(() => {
		setApps(apps => {
			return mergePinnedAppsToApps(apps, pinnedAppContext.pinnedAppNames);
		});
	}, [pinnedAppContext.pinnedAppNames]);

	useEffect(() => {
		setApps(apps => {
			const afterMerge = mergeOpenProcessToApps(apps, processContext.processes);
			return [...afterMerge];
		});
	}, [processContext.processes]);

	const handleOpenApp = (appName: string) => {
		processContext.openProcess(appName);
	};

	return (
		<StyledTaskbarApps>
			{
				apps.map(app =>
					<TaskbarApp
						onOpenApp={handleOpenApp}
						key={app.name}
						app={app}
					/>
				)
			}
		</StyledTaskbarApps>
	);
};

export default TaskbarApps;
