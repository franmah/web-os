import React, { createContext, FC } from 'react';
import useProcessContextState from '../hooks/UseProcessContextState';
import { ProcessContextType } from '../types/system/processes/Processes';

const START_PROCESS_CONTEXT: ProcessContextType = {
	closeProcess: () => {},
	closeProcessesByName: () => {},
	openProcess: () => {},
	processes: {}
};

export const ProcessContext = createContext<ProcessContextType>(START_PROCESS_CONTEXT);

const ProcessContextProvider: FC<{ children: React.ReactNode }> = ({ children }) => {

	return <ProcessContext.Provider value={useProcessContextState()}>{children}</ProcessContext.Provider>;
};

export default ProcessContextProvider;
