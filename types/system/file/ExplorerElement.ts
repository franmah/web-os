export type ExplorerFile = {
  children: ExplorerFile[];
  content?: string;
  iconPath?: string;
  isFolder: boolean;
  name: string;
  parent: ExplorerFile | null;
  id: string;
};