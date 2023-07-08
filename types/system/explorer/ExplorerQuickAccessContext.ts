export type ExplorerQuickAccessContextType = {
  pinToQuickAccess: (path: string) => void,
  unpinFromQuickAccess: (path: string) => void, 
  getQuickAccessPaths: () => string[];
}