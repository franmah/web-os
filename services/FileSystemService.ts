import { FOLDER_ICON_PATH } from '../constants/FileSystem';
import { ExplorerFile } from '../types/system/file/ExplorerElement';

export const getRootAtSystemStart = (): ExplorerFile => {
	const root: ExplorerFile = {
		name: 'root',
		id: 'root',
		children: [],
		parent: null,
		isFolder: true
	};

	root.children.push({
		name: 'Desktop',
		id: 'desktop',
		children: [],
		parent: root,
		isFolder: true
	});

	root.children.push({
		name: 'Documents',
		id: 'documents',
		children: [],
		parent: root,
		isFolder: true
	});

	root.children.push({
		name: 'Downloads',
		id: 'downloads',
		children: [],
		parent: root,
		isFolder: true
	});

	root.children.push({
		name: 'Pictures',
		id: 'pictures',
		children: [],
		parent: root,
		isFolder: true
	});

	root.children.push({
		name: 'Music',
		id: 'music',
		children: [],
		parent: root,
		isFolder: true
	});

	root.children.push({
		name: 'Videos',
		id: 'videos',
		children: [],
		parent: root,
		isFolder: true
	});

	root.children[0].children = getExampleDesktopChildren(root.children[0]);

	return root;
};

const getExampleDesktopChildren = (desktop: ExplorerFile): ExplorerFile[] => [
	{
		children: [],
		iconPath: FOLDER_ICON_PATH,
		name: 'New folder (2)',
		id: 'num #2',
		parent: desktop,
		isFolder: true
	},
	{
		children: [],
		iconPath: FOLDER_ICON_PATH,
		name: 'New folder (3)',
		id: 'num #3',
		parent: desktop,
		isFolder: true
	},
	{
		children: [
			{
				children: [
					{
						children: [],
						iconPath: FOLDER_ICON_PATH,
						name: 'sub folder 1',
						id: 'sub folder 1',
						parent: desktop,
						isFolder: true
					},
					{
						children: [],
						iconPath: FOLDER_ICON_PATH,
						name: 'sub folder 2',
						id: 'sub folder 2',
						parent: desktop,
						isFolder: true
					}
				],
				iconPath: FOLDER_ICON_PATH,
				name: 'sub folder',
				id: 'sub folder',
				parent: desktop,
				isFolder: true
			}
		],
		iconPath: FOLDER_ICON_PATH,
		name: 'New folder',
		id: 'num #1',
		parent: desktop,
		isFolder: true
	}
];
