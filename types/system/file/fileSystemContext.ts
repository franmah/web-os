import { ExplorerFile } from "./ExplorerElement";

export type FileSystemContextType = {
  getRoot: () => ExplorerFile,
  addFile: (name: string, iconPath: string, parent: ExplorerFile | null, id?: string) => void
  getDesktop: () => ExplorerFile;
};