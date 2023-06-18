import { createContext, FC } from "react";
import { useFileSystemContextState } from "../hooks/useFileSystemContextState";
import { FileSystemContextType } from "../types/system/file/fileSystemContext";

export const FileSystemContext = createContext<FileSystemContextType>(null as any);

const FileSystemContextProvider: FC = ({ children }) => {
  
  const { getRoot, appendFile, getDesktop, mkdir, updateFile, readdirV2 } = useFileSystemContextState();

  return (
    <FileSystemContext.Provider value={{ getRoot, appendFile, getDesktop, mkdir, updateFile, readdirV2 }}>
      { children }
    </FileSystemContext.Provider>
  );

};

export default FileSystemContextProvider;