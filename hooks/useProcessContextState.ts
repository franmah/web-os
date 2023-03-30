import { useState } from "react";
import { v4 } from "uuid";
import { ProcessDirectory } from "../System/process/ProcessDirectory";
import { startingProccesses } from "../System/process/StartingProccesses";
import { ProcessContextType, Processes } from "../types/system/processes/processes";

const _useProcessContextState = (): ProcessContextType => {
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

    const newProcessId =  ProcessDirectory[processName].isUnique ?
      ProcessDirectory[processName].name :
      v4();

      console.log(newProcessId);

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
      },
      id: newProcessId
    };

    setProcesses(currentProcesses => {
      const state = {
        ... currentProcesses,
        [newProcessId]: newProcess
      };
      console.log({ afterOpening: state})
      return state;
    });
  };

  return { processes, openProcess, closeProcess };
};

export default _useProcessContextState;