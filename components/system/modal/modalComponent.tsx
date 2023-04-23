import { FC, Ref, forwardRef, useImperativeHandle, useState } from "react";

export interface ModalComponentRef {
  showModal: (show: boolean) => void;
}

export const ModalComponent: FC<{
  top: number,
  left: number,
  showModal: number
}> = ({
  top,
  left,
  showModal
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
      hello
    </div>
  );
};