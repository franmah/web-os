import { ExplorerFile } from './ExplorerElement';

export type FileSystemContextType = {
	getRoot: () => ExplorerFile;
	appendFile: (name: string, iconPath: string, parent: ExplorerFile | null, id?: string, content?: any) => void;
	getDesktop: () => ExplorerFile;
	mkdir: (name: string, parent: ExplorerFile, id?: string) => void;
	updateFile: (file: ExplorerFile, content: any) => void;
	readdirV2: (path: string) => Promise<string[]>;
	searchFolderV2: (path: string, partialName: string) => Promise<string[]>;
	renameFolderV2: (path: string, newName: string) => Promise<void>;
	deleteFolderV2: (path: string) => Promise<void>;
	isDirectory: (path: string) => Promise<boolean>;
};
