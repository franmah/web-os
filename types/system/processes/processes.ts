import { WindowParams } from "../../../components/system/window/window";

export type Process = {
  name: string;
  Component: React.ComponentType<{ params: any }>;
  params: any | null;
  windowParams: WindowParams | null;
  hasWindow: boolean;
};

export type Processes = {
  [id: string]: Process;
};

export type ProcessContextType = {
  processes: Processes,
  openProcess: (processName: string, params?: any, windowParams?: Partial<WindowParams>) => void,
  closeProcess: (processId: string) => void,
};