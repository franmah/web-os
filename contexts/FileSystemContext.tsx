import { createContext, FC } from 'react';
import { useFileSystemContextState } from '../hooks/UseFileSystemContextState';
import { FileSystemContextType } from '../types/system/file/FileSystemContext';

export const FileSystemContext = createContext<FileSystemContextType>(null as any);

const FileSystemContextProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
	const fs = useFileSystemContextState();

	return <FileSystemContext.Provider value={fs}>{children}</FileSystemContext.Provider>;
};

export default FileSystemContextProvider;
