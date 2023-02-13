import { ProcessContext } from "../contexts/processContext";
import { Processes } from "../types/processes/processes";

export function ProcessLoader() {

  return (
    <ProcessContext.Consumer>
      { 
        (processes: Processes) => Object
          .entries(processes)
          .map(([id, { Component }]) => <Component key={id}></Component> ) 
      }
    </ProcessContext.Consumer>
  );
}