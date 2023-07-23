export type ExplorerItem = {
	children: ExplorerItem[];
	content?: any;
	name: string;
	parent: ExplorerItem | null;
	id: string;
};
