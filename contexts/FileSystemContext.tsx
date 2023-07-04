import { createContext, FC } from "react";
import { useFileSystemContextState } from "../hooks/useFileSystemContextState";
import { FileSystemContextType } from "../types/system/file/fileSystemContext";

export const FileSystemContext = createContext<FileSystemContextType>(null as any);

const FileSystemContextProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  
  const { getRoot, appendFile, getDesktop, mkdir, updateFile, readdirV2, searchFolderV2, renameFolderV2 } = useFileSystemContextState();

  return (
    <FileSystemContext.Provider value={{ getRoot, appendFile, getDesktop, mkdir, updateFile, readdirV2, searchFolderV2, renameFolderV2 }}>
      { children }
    </FileSystemContext.Provider>
  );

};

export default FileSystemContextProvider;