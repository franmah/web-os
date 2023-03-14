import { WindowProps } from "../../../components/system/window/window";

export type Process = {
  name: string;
  Component: React.ComponentType<{ params: any }>;
  params: any | null;
  windowParams: WindowProps | null;
  hasWindow: boolean;
};

export type Processes = {
  [id: string]: Process;
};

export type ProcessContextType = {
  processes: Processes,
  openProcess: (processName: string, params?: any, windowParams?: Partial<WindowProps>) => void,
  closeProcess: (processId: string) => void,
};