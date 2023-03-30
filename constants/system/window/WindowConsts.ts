import { WindowState } from "../../../types/system/window/WindowState";
import { MaximizePlaceholderDirection } from "./MaximizePlaceholderDirectionEnum";
import { WindowMaximize } from "./WindowMaximizeEnum";
import { WindowResizeDirection } from "./WindowResizeDirectionEnum";

export const DEFAULT_WINDOW_STATE: WindowState = {
  top: 50,
  left: 100,
  width: 1000,
  height: 600,
  previousClientX: 0,
  previousClientY: 0,
  previousTop: 100,
  previousLeft: 400,
  previousWidth: 1000,
  previousHeight: 600,
  moving: false,
  maximized: WindowMaximize.None,
  resizeDirection: WindowResizeDirection.None,
  showMaximizePlacehodler: MaximizePlaceholderDirection.None,
  selected: true
};