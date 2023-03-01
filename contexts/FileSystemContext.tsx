import { createContext, FC } from "react";
import { useFileSystemContextState } from "../hooks/useFileSystemContextState";
import { FileSystemContextType } from "../types/system/file/fileSystemContext";

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