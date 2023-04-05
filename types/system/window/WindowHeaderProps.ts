import { CustomMaximizeDirection } from "../../../components/system/window/maximizeOptionsModal/maximizeOptionsModal";
import { WindowMaximize } from "../../../constants/system/window/WindowMaximizeEnum";
import { WindowHeaderOptions } from "./WindowHeaderOptions";

export type WindowHeaderProps = {
  focused: boolean,
  options: WindowHeaderOptions | undefined,
  maximized: WindowMaximize,
  startMovingWindow: (event: any) => void,
  maximizeWindow: (event: any) => void,
  onClose: () => void,
  moveToCustomMaximizeOptionClick: (direcction: CustomMaximizeDirection) => void
};