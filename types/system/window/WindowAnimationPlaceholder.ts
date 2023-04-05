import { MaximizePlaceholderDirection } from "../../../constants/system/window/MaximizePlaceholderDirectionEnum";

export type WindowMaximizePlaceholderProps = {
  placeholderDirection: MaximizePlaceholderDirection,
  top: number,
  left: number,
  width: number,
  height: number,
  zIndex: number
};