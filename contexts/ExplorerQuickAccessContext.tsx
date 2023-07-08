import { FC, createContext } from "react";
import { useExplorerQuickAccessContextState } from "../hooks/UseExplorerQuickAccessContextState";
import { ExplorerQuickAccessContextType } from "../types/system/explorer/ExplorerQuickAccessContext";

export const ExplorerQuickAccessContext = createContext<ExplorerQuickAccessContextType>(null as any);

const ExplorerQuickAccessProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const { getQuickAccessPaths, pinToQuickAccess, unpinFromQuickAccess } = useExplorerQuickAccessContextState();
  return (
    <ExplorerQuickAccessContext.Provider value={{ getQuickAccessPaths, pinToQuickAccess, unpinFromQuickAccess }}>
      {children}
    </ExplorerQuickAccessContext.Provider>
  )
}

export default ExplorerQuickAccessProvider;