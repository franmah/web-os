import { ProcessNameEnum } from './ProcessNameEnum';

export const ProcessDirectoryByExtension: { [extension: string]: ProcessNameEnum } = {
	txt: ProcessNameEnum.SUN_TEXT_EDITOR,
	youtube: ProcessNameEnum.YOUTUBE
};
