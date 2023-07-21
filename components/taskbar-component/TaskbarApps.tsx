import { FC, useContext, useEffect, useState } from 'react';
import { TaskbarPinnedAppContext } from '../../contexts/TaskbarPinnedAppContext';
import { ProcessContext } from '../../contexts/ProcessContext';
import { mergeOpenProcessToApps, mergePinnedAppsToApps } from '../../services/system/taskbar/TaskbarAppService';
import { StyledTaskbarApp, TaskbarApp } from './TaskbarApp';
import styled from 'styled-components';
import { WindowContext } from '../../contexts/WindowContext';
import { ProcessNameEnum } from '../../System/process/ProcessNameEnum';
import { GeneralImageCommand } from '../../System/context-menu-commands/commands/GeneralImageCommand';
import { GeneralIconCommand } from '../../System/context-menu-commands/commands/GeneralIconCommand';
import { ProcessDirectory } from '../../System/process/ProcessDirectory';
import { TASKBAR_HEIGHT } from '../../constants/Taskbar';
import { CONTEXT_MENU_MEDIUM_WIDTH } from '../system/context-menu/ContextMenu';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import Image from 'next/image';
import { getCurrentItemNameInPath, getFileExtension } from '../../services/file-system/FilePathService';
import { ProcessDirectoryByExtension } from '../../System/process/ProcessDirectoryByExtension';
import { DRAG_DROP_DATA_TRANSFER_FIELDS, DRAG_DROP_SOURCE } from '../../constants/DragDrop';
import { FileSystemContext } from '../../contexts/FileSystemContext';

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
	flex: 1;

	.app-list {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
	}
`;

const PRE_TASKBAR_APP_ID = 'taskbar-app-';

const TaskbarApps: FC<{}> = () => {

	const [apps, setApps] = useState<TaskbarAppType[]>([]);

	const pinnedAppContext = useContext(TaskbarPinnedAppContext);
	const processContext = useContext(ProcessContext);
	const windowContext = useContext(WindowContext);
	const fs = useContext(FileSystemContext);

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

	const handleAppClicked = (appName: string) => {
		const app = apps.find(app => app.name === appName);
		if (!app) {
			console.error(`Error opening app from taskbar: can't find ${appName}.`);
			return;
		}

		if (app.open && app.multipleOpen) {
			// open first available window for that app.
			// TODO: replace by showing preview of open windows.
			const window = Object.entries(windowContext.windows).find(([windowId, window]) => window.process.name === appName);
			if (!window) {
				return;
			}
			windowContext.focusWindow(window[0]);
		} else if (app.open) {
			handleMinimizeWindow(appName);
		} else {
			processContext.openProcess(appName);
		}
	};

	const handleMinimizeWindow = (appName: string) => {
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

		if (minimized) {
			windowContext.unminimizeWindow(windowId);
		} else if (focused) {
			windowContext.minimizeWindow(windowId);
		} else {
			windowContext.focusWindow(windowId);
		}
	};

	const handleContextMenuClick = (event: MouseEvent, appName: string) => {
		event.preventDefault();
		event.stopPropagation();

		const app = apps.find(app => app.name === appName);
		if (!app) {
			console.error(`Error opening context menu for app: ${appName}: app not found`);
			return;
		}

		const pinCommand = app.pinned ?
			new GeneralIconCommand(
				'Unpin from taskbar',
				require('react-icons/tb').TbPinnedOff,
				() => pinnedAppContext.removePinnedAppNames(appName)
			) :
			new GeneralIconCommand(
				'Pin to taskbar',
				require('react-icons/tb').TbPin,
				() => pinnedAppContext.addPinnedAppNames(appName)
			);

		const commands = [
			new GeneralImageCommand(appName, ProcessDirectory[appName].iconPath || '', () => processContext.openProcess(appName)),
			pinCommand
		];

		if (app.open) {
			const processId = Object.values(processContext.processes).find(process => process.name === appName)?.processId || '';
			const closeCommmand = app.multipleOpen ?
				new GeneralIconCommand('Close all windows', require('react-icons/gr').GrClose, () => processContext.closeProcessesByName(appName)) :
				new GeneralIconCommand('Close window', require('react-icons/gr').GrClose, () => processContext.closeProcess(processId));
			commands.push(closeCommmand);
		}

		const taskbarAppElement = document.getElementById(PRE_TASKBAR_APP_ID + appName);
		if (!taskbarAppElement) {
			return;
		}

		const elementMiddlewidthFromLeft = taskbarAppElement?.offsetLeft + (taskbarAppElement.offsetWidth / 2);
		const HEIGHT_OFFSET = 20;

		processContext.openProcess(ProcessNameEnum.CONTEXT_MENU, {
			commands,
			left: elementMiddlewidthFromLeft - CONTEXT_MENU_MEDIUM_WIDTH / 2,
			top: window.innerHeight - TASKBAR_HEIGHT - HEIGHT_OFFSET
		});
	};

	const handleDragEnd = (result: any) => {
		const startIndex = result?.source?.index;
		const endIndex = result?.destination?.index;

		if (startIndex === undefined || endIndex === undefined) {
			// console.error('Error moving taskbar app: start or end index is null.');
			return;
		}

		setApps(apps => {
			const draggedApp = {...apps[startIndex]};
			apps.splice(startIndex, 1);
			apps.splice(endIndex, 0, draggedApp);
			return [...apps];
		});
	};

	const openStartMenu = () => {
		console.debug('TODO: open menu');
	};

	const onDrop = (event: any) => {
		event.preventDefault();
		const source = event?.dataTransfer?.getData(DRAG_DROP_DATA_TRANSFER_FIELDS.SOURCE);
		const path = event?.dataTransfer?.getData(DRAG_DROP_DATA_TRANSFER_FIELDS.PATH);

		if (source && source === DRAG_DROP_SOURCE.DESKTOP && path) {
			if (fs.isDirectory(path)){
				pinnedAppContext.addPinnedAppNames(ProcessNameEnum.EXPLORER);
				return;
			}

			const app = ProcessDirectoryByExtension[getFileExtension(getCurrentItemNameInPath(path))];
			pinnedAppContext.addPinnedAppNames(app);
		}
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
