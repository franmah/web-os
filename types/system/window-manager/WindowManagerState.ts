import { WindowedProcess } from "../processes/Processes";
import { WindowState } from "../window/WindowState";

export type WindowManagerState = {
  [windowId: string]: {
    state: WindowState,
    process: WindowedProcess,
    warnBeforeClosing: boolean
  }
};