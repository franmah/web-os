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