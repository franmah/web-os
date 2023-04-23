import { FC, Ref, forwardRef, useImperativeHandle, useState } from "react";

export interface ModalComponentRef {
  showModal: (show: boolean) => void;
}

export const ModalComponent = forwardRef((props, ref: Ref<ModalComponentRef>) => {
  const [modalIsOpen, setIsOpen] = useState<boolean>(false);

  useImperativeHandle(ref, () => ({
    showModal
  }));

  const showModal = (show: boolean) => {
    setIsOpen(() => show);
  }

  const style = {
    content: {
      top: 'calc(50% - 200px)',
      left: 'calc(50% - 200px)',
      height: '200px',
      width: '200px',
      backgroundColor: 'white'
    }
  }

  return (
    <></>
  );
});