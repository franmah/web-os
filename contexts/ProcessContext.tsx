import React, { createContext, FC } from 'react';
import useProcessContextState from '../hooks/UseProcessContextState';
import { ProcessContextType } from '../types/system/processes/Processes';

const START_PROCESS_CONTEXT: ProcessContextType = {
	processes: {},
	openProcess: () => {},
	closeProcess: () => {}
};

export const ProcessContext = createContext<ProcessContextType>(START_PROCESS_CONTEXT);

const ProcessContextProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
	const { processes, openProcess, closeProcess } = useProcessContextState();

	return <ProcessContext.Provider value={{ processes, openProcess, closeProcess }}>{children}</ProcessContext.Provider>;
};

export default ProcessContextProvider;
