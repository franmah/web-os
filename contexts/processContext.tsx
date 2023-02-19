import React, { createContext, FC } from "react";
import useProcessContextState from "../hooks/useProcessContextState";
import { ProcessContextType } from "../types/processes/processes";

const START_PROCESS_CONTEXT: ProcessContextType = {
  processes: {},
  openProcess: () => {},
  closeProcess: () => {}
};

export const ProcessContext = createContext<ProcessContextType>(START_PROCESS_CONTEXT);

const ProcessContextProvider: FC = ({ children }) => {

  const { processes, openProcess, closeProcess } = useProcessContextState();

  return (
    <ProcessContext.Provider value={{ processes, openProcess, closeProcess }}>
      { children }
    </ProcessContext.Provider>
  );
};

export default ProcessContextProvider;