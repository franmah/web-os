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

  const openProcess = (processName: string, params: any = null, windowParams: any = null) => {
    if (!ProcessDirectory[processName]) {
      return;
    }

    // TODO: only generate id is process is not unique
    const newProcessId = v4();

    const newProcess = {
      ...ProcessDirectory[processName],
      params: {
        ...ProcessDirectory[processName].params,
        ...params,
        processId: newProcessId
      },
      windowParams: {
        ...ProcessDirectory[processName].windowParams,
        ...windowParams,
        processId: newProcessId,
        windowId: v4()
      }
    };

    setProcesses(currentProcesses => {
      return {
        ... currentProcesses,
        [newProcessId]: newProcess
      };
    });
  };

  return { processes, openProcess, closeProcess };
};

export default useProcessContextState;