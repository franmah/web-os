import { clamp } from "../../../../shared/services/mathHelper";
import { SelectionBox } from "../../../../types/shared/SelectionBox";

export const getBoxNewPosition= (box: SelectionBox, clientX: number, clientY: number) => {

  const width = Math.abs(box.startX - +clientX);
  const height = Math.abs(box.startY - +clientY);

  // Mouse relative to start position
  const bottomRight = clientX >= box.startX && clientY >= box.startY;
  const bottomLeft = clientX < box.startX && clientY > box.startY;
  const topLeft = clientX <= box.startX && clientY <= box.startY;
  const topRight = clientX > box.startX && clientY < box.startY;

  let top = 0, left = 0;

  // TODO: prevent from going out of window
  if (bottomRight) {
    top = box.startY;
    left = box.startX;
  } else if (bottomLeft) {
    top = box.startY;
    left = clientX;
  } else if (topLeft) {
    top = clientY;
    left = clientX;
  } else if (topRight) {
    top = clientY;
    left = box.startX;
  }

  // TODO: create const file with taskbar size
  top = clamp(0, top, window.innerHeight - 75);
  left = clamp(0, left, document.body.clientWidth);

  return { top, left, width, height };
}