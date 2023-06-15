export type ExplorerFile = {
  children: ExplorerFile[];
  content?: any;
  iconPath?: string;
  isFolder: boolean;
  name: string;
  parent: ExplorerFile | null;
  id: string;
  extension?: string;
};