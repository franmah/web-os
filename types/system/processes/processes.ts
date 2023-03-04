export type Process = {
  name: string;
  Component: React.ComponentType<{ params: any }>;
  params: any | null;
  hasWindow: boolean
};

export type Processes = {
  [id: string]: Process;
};

export type ProcessContextType = {
  processes: Processes,
  openProcess: (processName: string, params?: any) => void,
  closeProcess: (processId: string) => void,
};