import { ProcessNameEnum } from '../../System/process/ProcessNameEnum';

export type AppContent = {
  appName: ProcessNameEnum;
  iconPath: string;
  payload: any;
}
