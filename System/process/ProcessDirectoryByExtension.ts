import { ProcessNameEnum } from './ProcessNameEnum';

export const ProcessDirectoryByExtension: { [extension: string]: string } = {
	txt: ProcessNameEnum.SUN_TEXT_EDITOR,
	youtube: ProcessNameEnum.YOUTUBE
};
