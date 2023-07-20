import { FC, useContext, useEffect, useState } from 'react';
import { TaskbarPinnedAppContext } from '../../contexts/TaskbarPinnedAppContext';
import { ProcessContext } from '../../contexts/ProcessContext';
import { mergeOpenProcessToApps, mergePinnedAppsToApps } from '../../services/system/taskbar/TaskbarAppService';
import { TaskbarApp } from './TaskbarApp';
import styled from 'styled-components';
import { WindowContext } from '../../contexts/WindowContext';

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
	const windowContext = useContext(WindowContext);

	useEffect(() => {
		setApps(apps => {
			return mergePinnedAppsToApps(apps, pinnedAppContext.pinnedAppNames);
		});
	}, [pinnedAppContext.pinnedAppNames]);

	useEffect(() => {
		setApps(apps => {
			const afterMerge = mergeOpenProcessToApps(apps, windowContext.windows);
			return [...afterMerge];
		});
	}, [windowContext.windows]);

	const handleClick = (appName: string) => {
		const app = apps.find(app => app.name === appName);
		if (!app) {
			console.error(`Error opening app from taskbar: can't find ${appName}.`);
			return;
		}

		if (app.open) {
			const windowToUpdate = Object.entries(windowContext.windows).find(([windowId, { process }]) => process.name === appName);
			if (!windowToUpdate) {
				console.error(`Error opening app from taskbar. can't find window to focus for app ${appName}.`);
				return;
			}

			// If app is unfocused: focus
			// else if minimized: focus
			// eles if focused: minimize
			const windowId = windowToUpdate[0];
			const minimized = windowToUpdate[1].state.minimized;
			const focused = windowToUpdate[1].state.focused;

			!focused || minimized ?
				windowContext.focusWindow(windowId) :
				windowContext.minimizeWindow(windowId);

		} else {
			processContext.openProcess(appName);
		}
	};

	return (
		<StyledTaskbarApps>
			{
				apps.map(app =>
					<TaskbarApp
						onOpenApp={handleClick}
						key={app.name}
						app={app}
					/>
				)
			}
		</StyledTaskbarApps>
	);
};

export default TaskbarApps;
