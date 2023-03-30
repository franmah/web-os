import { WindowProps } from "../window/WindowProps";

export type Process = {
  name: string;
  Component: React.ComponentType<{ params: any }>;
  params: any | null;
  windowParams: Partial<WindowProps> | null;
  hasWindow: boolean;
  isUnique: boolean;
  id: string;
};

export type Processes = {
  [id: string]: Process;
};

export type ProcessContextType = {
  processes: Processes,
  openProcess: (processName: string, params?: any, windowParams?: Partial<WindowProps>) => void,
  closeProcess: (processId: string) => void,
};