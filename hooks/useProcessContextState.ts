import { useState } from "react";
import { v4 } from "uuid";
import { ProcessDirectory } from "../System/process/ProcessDirectory";
import { Process, ProcessContextType, Processes, WindowedProcess } from "../types/system/processes/processes";

const _useProcessContextState = (): ProcessContextType => {
  
  const [processes, setProcesses] = useState<Processes>({});

  const closeProcess = (processId: string) => {
    setProcesses(currentProcesses => {
      return Object
        .entries(currentProcesses)
        .reduce(( processes, [id, process] ) => 
          id === processId ? processes : { ...processes, [id]: process }
          , {}
        )
    });
  };

  const openProcess = (processName: string, params: any = null, windowParams: any = null) => {
    if (!ProcessDirectory[processName]) {
      console.error(`Process name: ${processName} not found in directory.`);
      return;
    }

    const processDirectoryEntry = ProcessDirectory[processName];

    const newProcessId =  processDirectoryEntry.isUnique ?
      processDirectoryEntry.name :
      v4();

    const newProcess: Process = {
      ...processDirectoryEntry,
      params: {
        ...processDirectoryEntry.defaultParams,
        ...params,
        processId: newProcessId
      },
      processId: newProcessId
    };

    if (processDirectoryEntry.hasWindow) {
      (newProcess as WindowedProcess).windowParams = {
        ...processDirectoryEntry.windowParams,
        ...windowParams,
        windowId: v4()
      };
    }

    setProcesses(currentProcesses => {
      return {
        ... currentProcesses,
        [newProcessId]: newProcess
      };
    });
  };

  return { processes, openProcess, closeProcess };
};

export default _useProcessContextState;