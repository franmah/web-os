import { FC, createContext } from 'react';
import { useFocusedWindowContextState } from '../hooks/UseFocusedWindowContextState';
import { FocusedWindowContextType } from '../types/system/window/FocusedWindowContextType';

export const FocusedWindowContext = createContext<FocusedWindowContextType>(null as any);

const FocusedWindowContextProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const focusedWindowContext = useFocusedWindowContextState();

  return (
    <FocusedWindowContext.Provider value={focusedWindowContext}>
      { children }
    </FocusedWindowContext.Provider>
  );
};

export default FocusedWindowContextProvider;
