import { CustomMaximizeDirection } from '../../../constants/system/window/CustomMaximizeDirectionEnum';
import { WindowMaximize } from '../../../constants/system/window/WindowMaximizeEnum';
import { WindowHeaderOptions } from './WindowHeaderOptions';

export type WindowHeaderProps = {
	focused: boolean;
	options: WindowHeaderOptions;
	maximized: WindowMaximize;
	startMovingWindow: (event: any) => void;
	maximizeWindow: (event: any) => void;
	onClose: () => void;
	moveToCustomMaximizeOptionClick: (direcction: CustomMaximizeDirection) => void;
	onMinimize: () => void;
};
