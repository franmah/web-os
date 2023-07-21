import { WindowedProcess } from '../processes/Processes';
import { WindowState } from '../window/WindowState';

export type Window = {
	state: WindowState;
	process: WindowedProcess;
	warnBeforeClosing: boolean;
}

export type Windows = {
	[windowId: string]: Window;
};
