import dynamic from 'next/dynamic';
import { ProcessDirectoryType } from '../../types/system/processes/Processes';
import { IconPaths } from '../../constants/IconPaths';
import { ProcessNameEnum } from './ProcessNameEnum';

export const ProcessDirectory: ProcessDirectoryType = {
	[ProcessNameEnum.CONTEXT_MENU]: {
		Component: dynamic<{ params: any }>(() => import('../../components/system/context-menu/ContextMenuRoot')),
		hasWindow: false,
		isUnique: true,
		name: ProcessNameEnum.CONTEXT_MENU
	},
	[ProcessNameEnum.DESKTOP]: {
		Component: dynamic<{ params: any }>(() => import('../../components/desktop/desktop/Desktop')),
		defaultParams: null,
		hasWindow: false,
		isUnique: true,
		name: ProcessNameEnum.DESKTOP
	},
	[ProcessNameEnum.DOOM]: {
		Component: dynamic<{ params: any }>(() => import('../../components/dos/DosComponent')),
		hasWindow: true,
		isUnique: true,
		name: ProcessNameEnum.DOOM,
		windowParams: {
			headerOptions: {
				icon: IconPaths.DOOM,
				text: 'DOS - DOOM'
			}
		}
	},
	[ProcessNameEnum.EXPLORER]: {
		Component: dynamic<{ params: { startPath: string } }>(() => import('../../components/explorer/ExplorerContainer')),
		hasWindow: true,
		iconPath: IconPaths.EXPLROER,
		isUnique: false,
		name: ProcessNameEnum.EXPLORER,
		windowParams: {
			headerOptions: {
				icon: IconPaths.FOLDER,
				text: 'Explorer'
			}
		}
	},
	[ProcessNameEnum.PDF]: {
		Component: dynamic<{ params: { startPath: string } }>(() => import('../../components/pdf-reader/PdfReader')),
		hasWindow: true,
		iconPath: IconPaths.EXPLROER,
		isUnique: false,
		name: ProcessNameEnum.EXPLORER,
		windowParams: {
			headerOptions: {
				icon: IconPaths.FOLDER,
				text: 'Explorer'
			}
		}
	},
	[ProcessNameEnum.SUN_TEXT_EDITOR]: {
		Component: dynamic<{ params: { originalContent: string } }>(
			() => import('../../components/text-editor-app/Suneditor') as any
		),
		hasWindow: true,
		iconPath: IconPaths.NOTEPAD,
		isUnique: false,
		name: ProcessNameEnum.SUN_TEXT_EDITOR,
		windowParams: {
			headerOptions: {
				icon: IconPaths.TEXT,
				text: 'Text Editor'
			}
		}
	},
	[ProcessNameEnum.SIM_CITY_2000]: {
		Component: dynamic<{ params: any }>(() => import('../../components/dos/DosComponent')),
		hasWindow: true,
		isUnique: true,
		name: ProcessNameEnum.SIM_CITY_2000,
		windowParams: {
			headerOptions: {
				icon: IconPaths.DOOM,
				text: 'DOS - SIM CITY 2000'
			}
		}
	},
	[ProcessNameEnum.TAKSBAR]: {
		Component: dynamic<{ params: any }>(() => import('../../components/taskbar-component/Taskbar')),
		hasWindow: false,
		isUnique: true,
		name: ProcessNameEnum.TAKSBAR
	},
	[ProcessNameEnum.YOUTUBE]: {
		Component: dynamic<{ params: any }>(() => import('../../components/youtube/Youtube')),
		hasWindow: true,
		iconPath: IconPaths.YOUTUBE,
		isUnique: false,
		name: ProcessNameEnum.YOUTUBE,
		windowParams: {
			headerOptions: {
				icon: IconPaths.YOUTUBE,
				text: 'Youtube Player'
			}
		}
	}
};
