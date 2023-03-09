import { useState } from "react";
import { v4 } from "uuid";
import { ProcessDirectory } from "../System/process/ProcessDirectory";
import { startingProccesses } from "../System/process/StartingProccesses";
import { ProcessContextType, Processes } from "../types/system/processes/processes";

const useProcessContextState = (): ProcessContextType => {
  const [processes, setProcesses] = useState<Processes>(startingProccesses);

  const closeProcess = (processId: string) => {
    setProcesses(currentProcesses => {
      return Object
        .entries(currentProcesses)
        .reduce(( processes, [id, process] ) => 
          id === processId ? processes : { ...processes, [id]: process }
          , {}
        )
    })
  };

  const openProcess = (processName: string, params: any = null) => {
    if (!ProcessDirectory[processName]) {
      return;
    }

    setProcesses(currentProcesses => {
      const processes =  {
        ... currentProcesses,
        [processName]: {
          ...ProcessDirectory[processName],
          params: {
            ...ProcessDirectory[processName].params,
            ...params,
            windowId: v4()
          }
        }
      };

      return processes
    });
  };

  return { processes, openProcess, closeProcess };
};

export default useProcessContextState;