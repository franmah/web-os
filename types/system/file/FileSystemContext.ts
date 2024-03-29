import { ExplorerItem } from './ExplorerItem';

export type FileSystemContextType = {
	appendFile: (path: string, content?: any) => Promise<void>;
	deleteFolderV2: (path: string) => Promise<void>;
	getRoot: () => ExplorerItem;
	getDesktop: () => ExplorerItem;
	isDirectory: (path: string) => boolean;
	mkdir: (path: string) => Promise<void>;
	opendir: (path: string) => Promise<ExplorerItem[]>;
	readFile: (path: string) => ExplorerItem | null;
	readdirV2: (path: string) => Promise<string[]>;
	renameFolderV2: (path: string, newName: string) => Promise<void>;
	searchFolderV2: (path: string, partialName: string) => Promise<string[]>;
	exists: (path: string) => Promise<boolean>;
};
