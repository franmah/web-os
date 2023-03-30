import React, { createContext, FC } from "react";
import _useProcessContextState from "../hooks/useProcessContextState";
import { ProcessContextType } from "../types/system/processes/processes";

const START_PROCESS_CONTEXT: ProcessContextType = {
  processes: {},
  openProcess: () => {},
  closeProcess: () => {}
};

export const ProcessContext = createContext<ProcessContextType>(START_PROCESS_CONTEXT);

const ProcessContextProvider: FC = ({ children }) => {

  const { processes, openProcess, closeProcess } = _useProcessContextState();

  return (
    <ProcessContext.Provider value={{ processes, openProcess, closeProcess }}>
      { children }
    </ProcessContext.Provider>
  );
};

export default ProcessContextProvider;