import { WindowParams } from "../window/WindowProps";

export interface Process {
  name: string;
  Component: React.ComponentType<{ params: any }>;
  params: any | null;
  hasWindow: boolean;
  isUnique: boolean;
  processId: string;
};

export interface WindowedProcess extends Process  {
  hasWindow: true;
  windowParams: WindowParams
};

export type Processes = {
  [id: string]: Process;
};

export type WindowedProcesses = {
  [id: string]: WindowedProcess;
};

export type ProcessContextType = {
  processes: Processes,
  openProcess: (processName: string, params?: any, windowParams?: Partial<WindowParams>) => void,
  closeProcess: (processId: string) => void,
};