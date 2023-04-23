import { FC } from "react";

export interface ModalComponentRef {
  showModal: (show: boolean) => void;
}

export const WindowWarnCloseModalComponent: FC<{
  top: number,
  left: number,
  showModal: boolean,
  onClose: () => void,
  onCancel: () => void
}> = ({
  top,
  left,
  showModal,
  onClose,
  onCancel
}) => {

  return (
    <div
      style={{
        position: 'absolute',
        display: showModal ? 'block' : 'none',
        top: `calc(${top}px - 100px)`,
        left: `calc(${left}px - 100px)`,
        height: '200px',
        width: '200px',
        backgroundColor: 'red',
        zIndex: 100000
      }}
    >
      <button onClick={onClose}>Exit</button>
      <button onClick={onCancel}>Cancel</button>
    </div>
  );
};