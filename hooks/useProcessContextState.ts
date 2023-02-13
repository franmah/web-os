import { useState } from "react";
import { startingProccesses } from "../System/process/StartingProccesses";
import { Processes } from "../types/processes/processes";

const useProcessContextState = () => {
  const [processes, setProcesses] = useState<Processes>(startingProccesses);

  return { processes, setProcesses };
}

export default useProcessContextState;