import { WindowParams } from '../window/WindowProps';

export class Process {
	name: string;
	Component: React.ComponentType<{
		params: any;
		updateWarnUserBeforeClose?: (processId: string, canClose: boolean) => void;
	}>;
	params: any;
	hasWindow: boolean;
	isUnique: boolean;
	processId: string;

	constructor(
		name: string,
		Component: React.ComponentType<{ params: any }>,
		params: any,
		hasWindow: boolean,
		isUnique: boolean,
		processId: string
	) {
		this.name = name;
		this.Component = Component;
		this.params = params;
		this.hasWindow = hasWindow;
		this.isUnique = isUnique;
		this.processId = processId;
	}
}

export class WindowedProcess extends Process {
	windowParams: WindowParams;

	constructor(
		name: string,
		Component: React.ComponentType<{ params: any }>,
		params: any,
		hasWindow: boolean,
		isUnique: boolean,
		processId: string,
		windowParams: WindowParams
	) {
		super(name, Component, params, hasWindow, isUnique, processId);
		this.windowParams = windowParams;
	}
}

export type Processes = {
	[id: string]: Process;
};

export type WindowedProcesses = {
	[id: string]: WindowedProcess;
};

export type ProcessContextType = {
	processes: Processes;
	openProcess: (processName: string, params?: any, windowParams?: Partial<WindowParams>) => void;
	closeProcess: (processId: string) => void;
	closeProcessesByName: (processName: string) => void;
};

export type ProcessDirectoryEntry = {
	name: string;
	Component: React.ComponentType<{
		params: any;
		updateWarnUserBeforeClose?: (processId: string, canClose: boolean) => void;
	}>;
	defaultParams?: any;
	isUnique: boolean;
	hasWindow: boolean;
	windowParams?: Partial<WindowParams>;
	iconPath?: string;
};

export type ProcessDirectoryType = {
	[processName: string]: ProcessDirectoryEntry;
};
