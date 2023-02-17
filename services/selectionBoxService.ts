import { TASKBAR_HEIGHT } from "../constants/TaskbarConsts";
import { clamp } from "../shared/services/mathHelper";
import { SelectionBox, SelectionBoxSize } from "../types/shared/SelectionBox";

export const SELECTION_BOX_OFF: SelectionBox = {
  active: false,
  height: 0,
  left: 0,
  startX: 0,
  startY: 0,
  top: 0,
  width: 0,
  border: '0px solid transparent'
};

export const getElementsInBox = (elements: HTMLElement[], boxSize: SelectionBoxSize) => {
  return elements?.filter(element => isElementInBox(element, boxSize)) || [];
};

const isElementInBox = (element: HTMLElement, boxSize: SelectionBoxSize): boolean => {
  const { offsetTop, offsetLeft, clientWidth, clientHeight } = element;
  const elementTop = offsetTop;
  const elementBottom = offsetTop + clientHeight;
  const elementLeft = offsetLeft;
  const elementRight = offsetLeft + clientWidth;


  return (
    (boxSize.top < elementTop && elementTop < boxSize.bottom) ||
    (boxSize.top < elementBottom && elementBottom < boxSize.bottom)
      ) && (
    (boxSize.left < elementLeft && elementLeft < boxSize.right) ||
    (boxSize.left < elementRight && elementRight < boxSize.right)
    );
};

export const getBoxNewPosition = (box: SelectionBox, clientX: number, clientY: number, maxHeight: number, maxWidth: number) => {
  
  // Mouse relative to start position.
  const bottomRight = clientX >= box.startX && clientY >= box.startY;
  const bottomLeft = clientX < box.startX && clientY > box.startY;
  const topLeft = clientX <= box.startX && clientY <= box.startY;
  const topRight = clientX > box.startX && clientY < box.startY;

  let top = 0, left = 0, width = 0, height = 0;

  width = Math.abs(box.startX - clientX);
  height = Math.abs(box.startY - clientY);
  // Top and left will change depending if the derction of the mouse.
  // Top/left become either the start of the box or the end.
  if (bottomRight) {
    top = box.startY;
    left = box.startX;
    width =  Math.min(clientX, maxWidth) - box.startX;
    height = Math.min(clientY, maxHeight) - top;
  } else if (bottomLeft) {
    top = box.startY;
    left = Math.max(0, clientX);
    width = box.startX - left;
    height = Math.min(clientY, maxHeight) - top;
  } else if (topLeft) {
    top = Math.max(0, clientY);
    left = Math.max(0, clientX);
    width = box.startX - left;
    height = box.startY - top;
  } else if (topRight) {
    top = Math.max(0, clientY);
    left = box.startX;
    width = Math.min(clientX, maxWidth) - left;
    height = box.startY - top;
  }

  top = clamp(0, top, window.innerHeight - TASKBAR_HEIGHT);
  left = clamp(0, left, document.body.clientWidth);

  return { top, left, width, height };
};