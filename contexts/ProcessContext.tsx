import React, { createContext, FC } from 'react';
import useProcessContextState from '../hooks/UseProcessContextState';
import { ProcessContextType } from '../types/system/processes/Processes';

export const ProcessContext = createContext<ProcessContextType>(null as any);

const ProcessContextProvider: FC<{ children: React.ReactNode }> = ({ children }) => {

	return <ProcessContext.Provider value={useProcessContextState()}>{children}</ProcessContext.Provider>;
};

export default ProcessContextProvider;
