import { DragDropContext, Draggable, DropResult, Droppable } from 'react-beautiful-dnd';
import { FcApproval, FcApprove, FcAreaChart, FcBiotech, FcBookmark, FcCamera, FcClapperboard, FcGlobe } from 'react-icons/fc';
import { Component } from 'react';
import TaskbarShortcut from '../shortcut';
import styles from '../taskbar.module.scss';

class ShortcutBar extends Component {
  state = {
    shortcutIems: [
        (<FcAreaChart size={28} key={0}/>),
        (<FcBookmark size={28} key={1}/>),
        (<FcApproval size={28} key={2}/>),
        (<FcApprove size={28} key={3}/>),
        (<FcBiotech size={28} key={4}/>),
        (<FcCamera size={28} key={5}/>),
        (<FcClapperboard size={28} key={6}/>),
        (<FcGlobe size={28} key={7}/>)
    ]
  };

  handleReorderShortcutItemsOnDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(this.state.shortcutIems);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    this.setState({ shortcutIems: items });
  }

  render() {
    return (
      <DragDropContext onDragEnd={this.handleReorderShortcutItemsOnDragEnd}>
        <Droppable droppableId="taskbarShortcutItems" direction="horizontal">
          {
            (provided: any) => (
              <div className={styles.shortcuts} ref={provided.innerRef} {...provided.droppableProps}>
                { this.getFakeIconList() }
                {provided.placeholder}
              </div>
            )
          }
        </Droppable>
      </DragDropContext>
    );
  }

  getFakeIconList = () => this.state.shortcutIems.map((item: any, i) => (
      <Draggable key={i} draggableId={String(i)} index={i}>
        {
          (provided: any) => (
            <TaskbarShortcut>
              <div className={styles.shortcutItem} ref={provided.innerRef}
                {...provided.draggableProps} {...provided.dragHandleProps}
              >
                {item}
              </div>
            </TaskbarShortcut>
          )
        }
      </Draggable>
    ));
}

export default ShortcutBar;