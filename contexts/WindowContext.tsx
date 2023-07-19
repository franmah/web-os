import { FC, createContext } from 'react';
import { Windows } from '../types/system/window-manager/WindowManagerState';
import { useWindowContext } from '../hooks/UseWindowContext';
import { CustomMaximizeDirection } from '../constants/system/window/CustomMaximizeDirectionEnum';
import { WindowResizeDirection } from '../constants/system/window/WindowResizeDirectionEnum';

export type WindowContextType = {
  closeWindow: (windowId: string) => void;
  focusWindow: (windowId: string) => void;
  handleMouseUp: (windowId: string, event: MouseEvent) => void;
  heightMaximizeWindow: (windowId: string) => void;
  maximizeWindow: (windowId: string) => void;
  moveWindow: (windowId: string, event: MouseEvent) => void;
  moveWindowToCustomMaimizeOption: (windowId: string, direction: CustomMaximizeDirection) => void;
  startMovingWindow: (windowId: string, event: MouseEvent) => void;
  startResizingWindow: (windowId: string, event: MouseEvent, direction: WindowResizeDirection) => void;
  updateWarnBeforeProcessCloses: (processId: string, warn: boolean) => void;
  windows: Windows;
}

export const WindowContext = createContext<WindowContextType>(null as any);

const WindowContextProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <WindowContext.Provider value={useWindowContext()}>
      { children }
    </WindowContext.Provider>
  );
};

export default WindowContextProvider;
