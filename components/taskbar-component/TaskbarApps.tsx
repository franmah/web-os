import { FC, useContext, useEffect, useState } from 'react';
import { TaskbarPinnedAppContext } from '../../contexts/TaskbarPinnedAppContext';
import { ProcessContext } from '../../contexts/ProcessContext';
import * as taskbarAppService from '../../services/system/taskbar/TaskbarAppService';
import { TaskbarApp } from './TaskbarApp';
import { WindowContext } from '../../contexts/WindowContext';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import Image from 'next/image';
import { FileSystemContext } from '../../contexts/FileSystemContext';
import { StyledTaskbarApps } from '../../styled-components/system/taskbar/StyledTaskbarApps';
import { TaskbarAppType } from '../../types/taskbar/TaskbarAppType';
import { StyledTaskbarApp } from '../../styled-components/system/taskbar/StyledTaskbarApp';

export const PRE_TASKBAR_APP_ID = 'taskbar-app-';

const TaskbarApps: FC<{}> = () => {

	const [apps, setApps] = useState<TaskbarAppType[]>([]);

	const pinnedAppContext = useContext(TaskbarPinnedAppContext);
	const processContext = useContext(ProcessContext);
	const windowContext = useContext(WindowContext);
	const fs = useContext(FileSystemContext);

	useEffect(() => {
		setApps(apps => {
			return taskbarAppService.mergePinnedAppsToApps(apps, pinnedAppContext.pinnedAppNames);
		});
	}, [pinnedAppContext.pinnedAppNames]);

	useEffect(() => {
		setApps(apps => {
			const afterMerge = taskbarAppService.mergeOpenProcessToApps(apps, windowContext.windows);
			return [...afterMerge];
		});
	}, [windowContext.windows]);

	const handleAppClicked = (appName: string) => {
		taskbarAppService.handleAppClicked(appName, apps, windowContext, processContext);
	};

	const handleContextMenuClick = (event: MouseEvent, appName: string) => {
		event.preventDefault();
		event.stopPropagation();
		taskbarAppService.openContextMenu(appName, apps, pinnedAppContext, processContext);
	};

	const handleDragEnd = (result: any) => {
		setApps(apps => {
			return taskbarAppService.handleDragEnd(result, apps);
		});
	};

	const openStartMenu = () => {
		console.debug('TODO: open menu');
	};

	const onDrop = (event: any) => {
		event.preventDefault();
		taskbarAppService.handleItemDrop(event, fs, pinnedAppContext);
	};

	// Required to let user drop files on the taskbar
	const allowDrop = (event: any) => {
		event.preventDefault();
	};

	return (
		<StyledTaskbarApps
			onDrop={onDrop}
			onDragOver={allowDrop}
		>

			{/* Windows Home Button  */}
			<StyledTaskbarApp
				focused={false}
				multipleOpen={false}
				onClick={openStartMenu}
			>
				{/* eslint-disable-next-line react/jsx-no-undef */}
				<Image className='icon' src='/taskbar/windows-logo.png' alt='menu' height={24} width={24} />
			</StyledTaskbarApp>

			<DragDropContext
				onDragEnd={handleDragEnd}
			>
				<Droppable
					droppableId='taskbar-app-droppable'
					direction='horizontal'
				>
					{provided => (

						<div
							className='app-list'
							ref={provided.innerRef}
							{...provided.droppableProps}
						>
							{
								apps.map((app, index) =>
									<TaskbarApp
										id={PRE_TASKBAR_APP_ID + app.name}
										key={app.name}
										app={app}
										onOpenApp={handleAppClicked}
										onContextMenu={handleContextMenuClick}
										index={index}
									/>
								)
							}
							{provided.placeholder}
						</div>

					)}

				</Droppable>
			</DragDropContext>

		</StyledTaskbarApps>
	);
};

export default TaskbarApps;
