import { WindowedProcess } from "../processes/processes";
import { WindowState } from "../window/WindowState";

export type WindowManagerState = {
  windowId: string,
  state: WindowState,
  process: WindowedProcess
}[];