export type ExplorerElement = {
  children: ExplorerElement[];
  // contentPath: string;
  // iconPath: string;
  // isFolder: boolean;
  name: string;
  parent: ExplorerElement | null;
  icon: any // Needs to be changed;
}