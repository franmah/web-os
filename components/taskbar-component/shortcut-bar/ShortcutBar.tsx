import { DragDropContext, Draggable, DropResult, Droppable } from 'react-beautiful-dnd';
import { FcApproval, FcApprove, FcAreaChart, FcBiotech, FcBookmark,
  FcCamera, FcClapperboard, FcGlobe } from 'react-icons/fc';
import { FC, useState } from 'react';
import TaskbarShortcut from './shortcut/Shortcut';
import styles from './shortcutBar.module.scss';
import Image from 'next/image';

const ShortcutBar: FC<{}> = () => {

  const STARTING_ICONS = [
    (<FcAreaChart size={28} key={0}/>),
    (<FcBookmark size={28} key={1}/>),
    (<FcApproval size={28} key={2}/>),
    (<FcApprove size={28} key={3}/>),
    (<FcBiotech size={28} key={4}/>),
    (<FcCamera size={28} key={5}/>),
    (<FcClapperboard size={28} key={6}/>),
    (<FcGlobe size={28} key={7}/>)
  ];

  const [shortcutItems, setItems] = useState(STARTING_ICONS);

  const handleReorderShortcutItemsOnDragEnd = (result: DropResult) => {
    setItems(items => {
      if (!result.destination) 
        return items;

      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);
      return [...items];
    });
  };

  const getFakeIconList = () => shortcutItems.map((item: any, i) => (
    <Draggable key={i} draggableId={String(i)} index={i}>
      {
        (provided: any) => (
          <TaskbarShortcut>
            <div
              className={styles.shortcutItem}
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
            >
              {item}
            </div>
          </TaskbarShortcut>
        )
      }
    </Draggable>
  ));
  
  return (
    <section className={styles.shortcutBar}>
      <TaskbarShortcut>
        <Image src='/taskbar/windows-logo.png' alt='menu' height={23} width={23}/>
      </TaskbarShortcut>

      {
      /* TODO: put all drag/drop part into a wrapper component 
          If possible, move handleReorderShortcutItemsOnDragEnd to also be in that wrapper component
      
      */}
      {/* TODO: drag not working */}
      <DragDropContext onDragEnd={handleReorderShortcutItemsOnDragEnd}>
        <Droppable droppableId="taskbarShortcutItems" direction="horizontal">
          {
            (provided: any) => (
              <div
                className={styles.shortcuts}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >

                {getFakeIconList()}
                {provided.placeholder}
                
              </div>
            )
          }
        </Droppable>
      </DragDropContext>
    </section>
  );
};

export default ShortcutBar;