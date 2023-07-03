import { FC, createContext } from "react";
import { useExplorerQuickAccessContextState } from "../hooks/use-explorer-quick-access-context-state";
import { ExplorerQuickAccessContextType } from "../types/system/explorer/explorer-quick-access-context-type";

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