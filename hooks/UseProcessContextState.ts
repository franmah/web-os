import { useContext, useState } from 'react';
import { v4 } from 'uuid';
import { ProcessDirectory } from '../System/process/ProcessDirectory';
import { Process, ProcessContextType, Processes, WindowedProcess } from '../types/system/processes/Processes';
import { saveAnalyticsEvent } from '../services/AnalyticsService';
import { AnalyticEvents } from '../constants/AnalyticEvents';
import { FileSystemContext } from '../contexts/FileSystemContext';
import { getCurrentItemNameInPath, getFileExtension } from '../services/file-system/FilePathService';
import { ProcessNameEnum } from '../System/process/ProcessNameEnum';
import { SupportedFileExtension } from '../constants/SupportedFileExtension';
import { DosAppContentPayload } from '../types/apps/DosAppContentPayload';
import { AppContent } from '../types/apps/AppContent';
import { WindowParams } from '../types/system/window/WindowProps';

const useProcessContextState = (): ProcessContextType => {

	const fs = useContext(FileSystemContext);

	const [processes, setProcesses] = useState<Processes>({});

	// Make it easier to track windows by id instead of using uuid.
	const [windowIdCount, setWindowIdCount] = useState(0);

	const closeProcess = (processId: string) => {
		setProcesses(currentProcesses => {
			return Object.entries(currentProcesses).reduce(
				(processes, [id, process]) => (id === processId ? processes : { ...processes, [id]: process }),
				{}
			);
		});
	};

	const closeProcessesByName = (processName: string) => {
		setProcesses(currentProcesses => {
			return Object.entries(currentProcesses).reduce(
				(processes, [id, process]) => (process.name === processName ? processes : { ...processes, [id]: process }),
				{}
			);
		});
	};

	const openFile = (path: string, params?: any, windowParams?: Partial<WindowParams>) => {
		const extension = getFileExtension(getCurrentItemNameInPath(path));

		switch (extension) {
			case '': return openProcess(ProcessNameEnum.EXPLORER, params, windowParams);
			case SupportedFileExtension.TXT: return openProcess(ProcessNameEnum.SUN_TEXT_EDITOR, { ...params, path }, windowParams);
			case SupportedFileExtension.YOUTUBE: return openProcess(ProcessNameEnum.YOUTUBE, params, windowParams);
			case SupportedFileExtension.DOOM: return openDosApp(path, params, windowParams);
			case SupportedFileExtension.SIM_CITY_2000: return openDosApp(path, params, windowParams);
			default: console.error(`Error opening process from file: unknown extension (${extension}) for path ${path}`);
		}
	};

	const openDosApp = (path: string, params?: any, windowParams?: Partial<WindowParams>) => {
		const file = fs.readFile(path);
		const fileContent = JSON.parse(file.content) as AppContent;
		const payload = fileContent.payload as DosAppContentPayload;
		const dosFilePath = payload.dosFilePath;
		openProcess(ProcessNameEnum.DOOM, { ...params, dosFilePath }, windowParams);
	};

	const openProcess = (processName: string, params: any = null, windowParams: any = null) => {
		if (processName !== 'desktop' && processName !== 'taskbar' && processName !== 'contextMenu')
			saveAnalyticsEvent(AnalyticEvents.OPEN_PROCESS, { process: processName });

		if (!ProcessDirectory[processName]) {
			console.error(`Process name: ${processName} not found in directory.`);
			return;
		}

		const processDirectoryEntry = ProcessDirectory[processName];

		const newProcessId = processDirectoryEntry.isUnique ? processDirectoryEntry.name : v4();

		const processParams: any = {
			...processDirectoryEntry.defaultParams,
			...params,
			processId: newProcessId
		};

		let newProcess: Process;

		if (processDirectoryEntry.hasWindow) {
			const finalWindowParams = {
				...processDirectoryEntry.windowParams,
				...windowParams,
				windowId: `${windowIdCount}`
			};

			newProcess = new WindowedProcess(
				processName,
				processDirectoryEntry.Component,
				processParams,
				true,
				processDirectoryEntry.isUnique,
				newProcessId,
				finalWindowParams
			);
		} else {
			newProcess = new Process(
				processName,
				processDirectoryEntry.Component,
				processParams,
				false,
				processDirectoryEntry.isUnique,
				newProcessId
			);
		}

		setProcesses(currentProcesses => {
			return {
				...currentProcesses,
				[newProcessId]: newProcess
			};
		});

		setWindowIdCount(windowIdCount + 1);
	};

	return { closeProcess, closeProcessesByName, openFile, openProcess, processes } as ProcessContextType;
};

export default useProcessContextState;
