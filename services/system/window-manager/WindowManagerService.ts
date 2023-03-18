import { WindowForcedPositions } from "../../../components/system/WindowManager";
import { Processes } from "../../../types/system/processes/processes";

export const getEveryWindowPositions = (windowedProcesses: Processes) => {
  return Object.entries(windowedProcesses)
      .filter(([_, process]) => process.hasWindow)
      .map(([_, process]) => process.windowParams?.windowId || '')
      .map(id => {
        const element = document.getElementById(id);
        return {
          top: Math.floor(element?.offsetTop || 0),
          left: Math.floor(element?.offsetLeft || 0)
        }
      });
};

export const getNewWindowPosition = (processes: Processes, currentForcedPositions: WindowForcedPositions) 
: WindowForcedPositions => {
  const currentWindowIds = Object.keys(currentForcedPositions);
    const process = Object.values(processes).find(process => {
      const windowId = process.windowParams?.windowId || '';
      return !currentWindowIds.includes(windowId);
    });

    if (!process) { return currentForcedPositions }

    const newWindowId = process.windowParams?.windowId || '';
    const everyWindowPositions = getEveryWindowPositions(processes);

    console.log({everyWindowPositions})

    return {
      ...currentForcedPositions,
      [newWindowId]: {
          top: Math.random() * 150,
          left: Math.random() * 150,
          height: Math.random() * 400,
          width: Math.random() * 400
        }
    }
}