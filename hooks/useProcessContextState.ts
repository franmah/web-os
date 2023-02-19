import { useState } from "react";
import { ProcessDirectory } from "../System/process/ProcessDirectory";
import { startingProccesses } from "../System/process/StartingProccesses";
import { ProcessContextType, Processes } from "../types/processes/processes";

// In its own file because more functions (with logic) will be added (close, open...)
// Should only be accessed by ProcessContextProvider
const useProcessContextState = (): ProcessContextType => {
  const [processes, setProcesses] = useState<Processes>(startingProccesses);

  const closeProcess = (processId: string) => {
    setProcesses(currentProcesses => {
      console.log({currentProcesses})
      return Object
        .entries(currentProcesses)
        .reduce(( processes, [id, process] ) => 
          id === processId ? processes : { ...processes, [id]: process }
          , {}
        )
    })
  };

  const openProcess = (processName: string) => {
    if (!ProcessDirectory[processName]) {
      return;
    }

    setProcesses(currentProcesses => 
      ({ ... currentProcesses, [processName]: ProcessDirectory[processName] })
    )
  };

  return { processes, openProcess, closeProcess };
}

export default useProcessContextState;