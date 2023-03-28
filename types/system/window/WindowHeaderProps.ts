import { CustomMaximizeDirection } from "../../../components/system/window/maximizeOptionsModal/maximizeOptionsModal";
import { WindowMaximize } from "../../../constants/system/window/WindowMaximizeEnum";
import { WindowHeaderOptions } from "./WindowHeaderOptions";

export type WindowHeaderProps = {
  selected: boolean,
  options: WindowHeaderOptions | undefined,
  maximized: WindowMaximize,
  startMovingWindow: (event: any) => void,
  maximizeWindow: (event: any) => void,
  onClose: () => void,
  moveToCustomMaximizeOptionClick: (direcction: CustomMaximizeDirection) => void
};