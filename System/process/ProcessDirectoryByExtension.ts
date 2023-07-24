import { ProcessNameEnum } from './ProcessNameEnum';

export const ProcessDirectoryByExtension: { [extension: string]: ProcessNameEnum } = {
	pdf: ProcessNameEnum.PDF,
	txt: ProcessNameEnum.SUN_TEXT_EDITOR,
	youtube: ProcessNameEnum.YOUTUBE
};
