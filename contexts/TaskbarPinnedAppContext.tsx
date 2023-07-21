import { FC, createContext } from 'react';
import { useTaskbarPinnedAppContextState } from '../hooks/UseTaskbarPinnedAppContextState';

export type TaskbarPinnedAppContextType = {
    addPinnedAppNames: (...appNames: string[]) => void;
    pinnedAppNames: string[];
    removePinnedAppNames: (...appNames: string[]) => void;
}
export const TaskbarPinnedAppContext = createContext<TaskbarPinnedAppContextType>(null as any);

export const TaskbarPinnedAppProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <TaskbarPinnedAppContext.Provider value={useTaskbarPinnedAppContextState()} >
      { children }
    </TaskbarPinnedAppContext.Provider>
  );
};
