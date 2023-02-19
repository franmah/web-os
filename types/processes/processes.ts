export type Process = {
  name: string;
  Component: React.ComponentType<{}>;
};

export type Processes = {
  [id: string]: Process;
};

export type ProcessContextType = {
  processes: Processes,
  openProcess: (processName: string) => void,
  closeProcess: (processId: string) => void,
}