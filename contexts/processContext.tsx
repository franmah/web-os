import React, { createContext, FC } from "react";
import useProcessContextState from "../hooks/useProcessContextState";
import { Processes } from "../types/processes/processes";

export const ProcessContext = createContext<Processes>({});

const ProcessContextProvider: FC = ({ children }) => {

  const { processes } = useProcessContextState();

  return (
    <ProcessContext.Provider value={processes}>
      { children }
    </ProcessContext.Provider>
  );
};

export default ProcessContextProvider;