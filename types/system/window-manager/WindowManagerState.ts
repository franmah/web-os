import { Process } from "../processes/processes";
import { WindowState } from "../window/WindowState";

export type WindowManagerState = {
  [windowId: string]: {
    state: WindowState,
    process: Process
  }
};