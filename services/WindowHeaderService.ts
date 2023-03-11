import { Dispatch, SetStateAction } from "react";

export const setMaximizeMenuListeners = (maximizeElementId: string,
setShowMaximizeMenu: Dispatch<SetStateAction<boolean>>) => {
  let timeout: NodeJS.Timeout;

  const maximizeIconHeaderElement = document.getElementById(maximizeElementId);
  if (!maximizeIconHeaderElement) { return; }

  const onMouseEnter = () => {
    timeout = setTimeout(() => {
      setShowMaximizeMenu(true) 
    }, 100);
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