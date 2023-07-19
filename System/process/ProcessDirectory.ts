import dynamic from 'next/dynamic';
import { ProcessDirectoryType } from '../../types/system/processes/Processes';
import { IconPaths } from '../../constants/IconPaths';
import { ProcessNameEnum } from './ProcessNameEnum';

export const ProcessDirectory: ProcessDirectoryType = {
	[ProcessNameEnum.CONTEXT_MENU]: {
		Component: dynamic<{ params: any }>(() => import('../../components/system/context-menu/ContextMenuRoot')),
		hasWindow: false,
		isUnique: true,
		name: ProcessNameEnum.CONTEXT_MENU,
		owner: 'SYSTEM'
	},
	[ProcessNameEnum.DESKTOP]: {
		Component: dynamic<{ params: any }>(() => import('../../components/desktop/desktop/Desktop')),
		defaultParams: null,
		hasWindow: false,
		isUnique: true,
		name: ProcessNameEnum.DESKTOP,
		owner: 'SYSTEM'
	},
	[ProcessNameEnum.EXPLORER]: {
		Component: dynamic<{ params: { startPath: string } }>(() => import('../../components/explorer/ExplorerContainer')),
		hasWindow: true,
		iconPath: IconPaths.FOLDER,
		isUnique: false,
		name: ProcessNameEnum.EXPLORER,
		owner: 'USER',
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
		iconPath: IconPaths.TEXT,
		isUnique: false,
		name: ProcessNameEnum.SUN_TEXT_EDITOR,
		owner: 'USER',
		windowParams: {
			headerOptions: {
				icon: IconPaths.TEXT,
				text: 'Text Editor'
			}
		}
	},
	[ProcessNameEnum.TAKSBAR]: {
		Component: dynamic<{ params: any }>(() => import('../../components/taskbar-component/taskbar/Taskbar')),
		hasWindow: false,
		isUnique: true,
		name: ProcessNameEnum.TAKSBAR,
		owner: 'SYSTEM'
	},
	[ProcessNameEnum.YOUTUBE]: {
		Component: dynamic<{ params: any }>(() => import('../../components/youtube/Youtube')),
		hasWindow: true,
		iconPath: IconPaths.YOUTUBE,
		isUnique: false,
		name: ProcessNameEnum.YOUTUBE,
		owner: 'USER',
		windowParams: {
			headerOptions: {
				icon: IconPaths.YOUTUBE,
				text: 'Youtube Player'
			}
		}
	}
};
