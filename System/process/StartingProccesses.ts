import { ProcessDirectory } from './ProcessDirectory';
import { ProcessNameEnum } from './ProcessNameEnum';

export const startingProccesses: any = {
	desktop: {
		...ProcessDirectory[ProcessNameEnum.DESKTOP],
		windowParams: null
	},
	taskbar: {
		...ProcessDirectory[ProcessNameEnum.TAKSBAR],
		windowParams: null
	}
};
