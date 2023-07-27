import { ProcessNameEnum } from '../System/process/ProcessNameEnum';
import { DosAppFilesDirectory } from '../constants/DosAppFileLinks';
import { IconPaths } from '../constants/IconPaths';
import { AppContent } from '../types/apps/AppContent';
import { DosAppContentPayload } from '../types/apps/DosAppContentPayload';
import { ExplorerItem } from '../types/system/file/ExplorerItem';

export const getRootAtSystemStart = (): ExplorerItem => {
	const root: ExplorerItem = {
		name: 'root',
		id: 'root',
		children: [],
		parent: null
	};

	root.children.push({
		name: 'Desktop',
		id: 'desktop',
		children: [],
		parent: root
	});

	root.children.push({
		name: 'Documents',
		id: 'documents',
		children: [],
		parent: root
	});

	root.children.push({
		name: 'Downloads',
		id: 'downloads',
		children: [],
		parent: root
	});

	root.children.push({
		name: 'Pictures',
		id: 'pictures',
		children: [],
		parent: root
	});

	root.children.push({
		name: 'Music',
		id: 'music',
		children: [],
		parent: root
	});

	root.children.push({
		name: 'Videos',
		id: 'videos',
		children: [],
		parent: root
	});

	root.children[0].children = getExampleDesktopChildren(root.children[0]);

	return root;
};

const getExampleDesktopChildren = (desktop: ExplorerItem): ExplorerItem[] => [
	{
		children: [],
		content: JSON.stringify({
			appName: ProcessNameEnum.DOOM,
			payload: {
				dosFilePath: DosAppFilesDirectory.DOOM
			} as DosAppContentPayload
		} as AppContent),
		id: 'doom.doom',
		name: 'DOOM.doom',
		parent: desktop
	},
	{
		children: [],
		content: JSON.stringify({
			appName: ProcessNameEnum.SIM_CITY_2000,
			payload: {
				dosFilePath: DosAppFilesDirectory.SIM_CITY_2000
			} as DosAppContentPayload
		} as AppContent),
		id: 'sim_city_2000',
		name: 'Sim City 2000.' + ProcessNameEnum.SIM_CITY_2000,
		parent: desktop
	},
	{
		children: [],
		name: 'New folder (1)',
		id: 'num #2',
		parent: desktop
	},
	{
		children: [],
		name: 'Introducing Windows 11.youtube',
		id: 'youtube-video-1',
		parent: desktop
	},
	{
		children: [],
		name: 'Text.txt',
		id: 'text-1',
		parent: desktop
	},
	{
		children: [
			{
				children: [
					{
						children: [],
						name: 'sub folder 1',
						id: 'sub folder 1',
						parent: desktop
					},
					{
						children: [],
						name: 'sub folder 2',
						id: 'sub folder 2',
						parent: desktop
					}
				],
				name: 'sub folder',
				id: 'sub folder',
				parent: desktop
			}
		],
		name: 'New folder',
		id: 'num #1',
		parent: desktop
	}
];
