import { FC, useEffect, useState } from "react";

const Draggable: FC<{
  onDrag: (newPosition: number) => void,
  children: React.ReactNode
}> = ({ onDrag, children }) => {

  const [startDragPosition, setStartDragPosition] = useState(0);
  const [startDragMousePosition, setStartDragMousePosition] = useState(0);
  const [isMoving, setIsMoving] = useState(false);
  
  useEffect(() => {
    if (isMoving) {
      document.addEventListener('mousemove', handleDrag);
      document.addEventListener('mouseup', stopDrag);
    }

    return (() => {
      document.removeEventListener('mousemove', handleDrag);
      document.removeEventListener('mouseup', handleDrag);
    });
  }, [isMoving]);

  const handleDragStart = (e: any) => {
    const xPosition = e.clientX - e.currentTarget.offsetLeft;
    setStartDragPosition(xPosition);
    setStartDragMousePosition(e.clientX);
    setIsMoving(true);

  };

  const stopDrag = () => {
    setIsMoving(false);
  }

  const handleDrag = (e: any) => {
    const mouseChange = startDragMousePosition - e.clientX;
    const newPosition = startDragPosition - mouseChange;
    onDrag(newPosition);
  };

  return (
    <div
      onMouseDown={handleDragStart}
    >
      { children }
    </div>
  );
}

export default Draggable;