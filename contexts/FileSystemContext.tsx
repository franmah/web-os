import { createContext, FC } from "react";
import { useFileSystemContextState } from "../hooks/useFileSystemContextState";
import { ExplorerFile } from "../types/ExplorerElement";

export type FileSystemContextType = {
  root: ExplorerFile,
  addFile: (name: string, iconPath: string, parent: ExplorerFile | null) => void
  getDesktop: () => ExplorerFile;
};

export const FileSystemContext = createContext<FileSystemContextType>(null as any);

const FileSystemContextProvider: FC = ({ children }) => {
  
  const { root, addFile, getDesktop } = useFileSystemContextState();

  return (
    <FileSystemContext.Provider value={{ root, addFile, getDesktop }}>
      { children }
    </FileSystemContext.Provider>
  );

};

export default FileSystemContextProvider;