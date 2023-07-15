import dynamic from 'next/dynamic';
import { ProcessDirectoryType } from '../../types/system/processes/Processes';
import { IconPaths } from '../../constants/IconPaths';

export const ProcessDirectory: ProcessDirectoryType = {
	contextMenu: {
		Component: dynamic<{ params: any }>(() => import('../../components/system/context-menu/ContextMenuRoot')),
		hasWindow: false,
		isUnique: true,
		name: 'contextMenu'
	},
	desktop: {
		Component: dynamic<{ params: any }>(() => import('../../components/desktop/desktop/Desktop')),
		defaultParams: null,
		hasWindow: false,
		isUnique: true,
		name: 'desktop'
	},
	explorer: {
		Component: dynamic<{ params: { startPath: string } }>(() => import('../../components/explorer/ExplorerContainer')),
		hasWindow: true,
		isUnique: false,
		name: 'explorer',
		windowParams: {
			headerOptions: {
				icon: IconPaths.FOLDER,
				text: 'Explorer'
			}
		}
	},
	sunTextEditor: {
		Component: dynamic<{ params: { originalContent: string } }>(
			() => import('../../components/text-editor-app/Suneditor') as any
		),
		hasWindow: true,
		isUnique: false,
		name: 'sunTextEditor',
		windowParams: {
			headerOptions: {
				icon: IconPaths.TEXT,
				text: 'Text Editor'
			}
		}
	},
	taskbar: {
		Component: dynamic<{ params: any }>(() => import('../../components/taskbar-component/taskbar/Taskbar')),
		hasWindow: false,
		isUnique: true,
		name: 'taskbar'
	},
	youtube: {
		Component: dynamic<{ params: any }>(() => import('../../components/youtube/Youtube')),
		hasWindow: true,
		isUnique: false,
		name: 'youtube',
		windowParams: {
			headerOptions: {
				icon: IconPaths.YOUTUBE,
				text: 'Youtube Player'
			}
		}
	}
};
