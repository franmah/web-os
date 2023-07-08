import { useState } from "react";
import { v4 } from "uuid";
import { ProcessDirectory } from "../System/process/ProcessDirectory";
import { Process, ProcessContextType, Processes, WindowedProcess } from "../types/system/processes/processes";

const useProcessContextState = (): ProcessContextType => {
  
  const [processes, setProcesses] = useState<Processes>({});

  // Make it easier to track windows by id instead of using uuid.
  const [windowIdCount, setWindowIdCount] = useState(0);

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

    const processParams: any = {
      ...processDirectoryEntry.defaultParams,
      ...params,
      processId: newProcessId
    };

    let newProcess: Process;

    if (processDirectoryEntry.hasWindow) {
      const finalWindowParams = {
        ...processDirectoryEntry.windowParams,
        ...windowParams,
        windowId: `${windowIdCount}`
      };

      newProcess = new WindowedProcess(processName,processDirectoryEntry.Component,
        processParams, true, processDirectoryEntry.isUnique, newProcessId, finalWindowParams
      );
    } else {
      newProcess = new Process(
        processName,
        processDirectoryEntry.Component,
        processParams,
        false,
        processDirectoryEntry.isUnique,
        newProcessId
      );
    }

    setProcesses(currentProcesses => {
      return {
        ... currentProcesses,
        [newProcessId]: newProcess
      };
    });

    setWindowIdCount(windowIdCount + 1);
  };

  return { processes, openProcess, closeProcess };
};

export default useProcessContextState;