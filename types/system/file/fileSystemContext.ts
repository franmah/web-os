import { ExplorerFile } from "./ExplorerElement";

export type FileSystemContextType = {
  getRoot: () => ExplorerFile,
  appendFile: (name: string, iconPath: string, parent: ExplorerFile | null, id?: string) => void,
  getDesktop: () => ExplorerFile,
  mkdir: (name: string, parent: ExplorerFile, id?: string) => void
};