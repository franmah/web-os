export type ExplorerFile = {
  children: ExplorerFile[];
  // contentPath: string;
  iconPath?: string;
  // isFolder: boolean;
  name: string;
  parent: ExplorerFile | null;
  id?: string // TODO: remove question mark
}