import { Dispatch, SetStateAction } from "react";
import { CUSTOM_MAXIMIZE_MODAL_DELAY } from "../../../constants/system/window/WindowHeader";

export const setMaximizeMenuListeners = (maximizeElementId: string,
setShowMaximizeMenu: Dispatch<SetStateAction<boolean>>) => {
  let timeout: NodeJS.Timeout;

  const maximizeIconHeaderElement = document.getElementById(maximizeElementId);
  if (!maximizeIconHeaderElement) { return; }

  const onMouseEnter = () => {
    timeout = setTimeout(() => {
      setShowMaximizeMenu(true) 
    }, CUSTOM_MAXIMIZE_MODAL_DELAY);
  };

  const onMouseLeave = () => {
    clearTimeout(timeout);
    setShowMaximizeMenu(false);
  };

  maximizeIconHeaderElement.addEventListener('mouseenter', onMouseEnter);
  maximizeIconHeaderElement.addEventListener('mouseleave', onMouseLeave);

  return () => {
    clearTimeout(timeout);
    maximizeIconHeaderElement.removeEventListener('mouseenter', onMouseEnter);
    maximizeIconHeaderElement.removeEventListener('mouseleave', onMouseLeave);
  };
}