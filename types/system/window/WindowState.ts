import { MaximizePlaceholderDirection } from "../../../constants/system/window/MaximizePlaceholderDirectionEnum";
import { WindowMaximize } from "../../../constants/system/window/WindowMaximizeEnum";
import { WindowResizeDirection } from "../../../constants/system/window/WindowResizeDirectionEnum";

export type WindowState = {
  top: number,
  left: number,
  width: number,
  height: number,
  moving: boolean,
  resizeDirection: WindowResizeDirection,
  previousClientX: number,
  previousClientY: number,
  previousTop: number,
  previousLeft: number,
  previousWidth: number,
  previousHeight: number,
  maximized: WindowMaximize,
  showMaximizePlacehodler: MaximizePlaceholderDirection,
  selected: boolean
};